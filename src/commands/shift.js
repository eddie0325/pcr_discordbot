/** 預設完整時間軸長度（秒） */
const DEFAULT_FULL_SECONDS = 90;

/**
 * 將開頭時間字串解析為總秒數。
 * 支援：1:11、111（1 分 11 秒）、057（0 分 57 秒）、0129（MMSS，1 分 29 秒）
 */
function parseTimeToken(raw) {
    if (raw.includes(':')) {
        const parts = raw.split(':');
        if (parts.length !== 2) return null;
        const mm = parseInt(parts[0], 10);
        const ss = parseInt(parts[1], 10);
        if (Number.isNaN(mm) || Number.isNaN(ss) || ss > 59) return null;
        return mm * 60 + ss;
    }
    if (/^\d{4}$/.test(raw)) {
        const mm = parseInt(raw.slice(0, 2), 10);
        const ss = parseInt(raw.slice(2, 4), 10);
        if (Number.isNaN(mm) || Number.isNaN(ss) || ss > 59) return null;
        return mm * 60 + ss;
    }
    if (/^\d{3}$/.test(raw)) {
        const min = parseInt(raw[0], 10);
        const sec = parseInt(raw.slice(1), 10);
        if (Number.isNaN(min) || Number.isNaN(sec)) return null;
        if (sec <= 59) return min * 60 + sec;
        return null;
    }
    return null;
}

function formatTimelineSeconds(sec) {
    const s = Math.max(0, sec);
    const m = Math.floor(s / 60);
    const r = s % 60;
    return m + ':' + String(r).padStart(2, '0');
}

/** 小於 0 的秒數，以 -m:ss 表示（例如 -0:03） */
function formatNegativeTimelineSeconds(sec) {
    const abs = Math.abs(sec);
    const m = Math.floor(abs / 60);
    const r = abs % 60;
    return '-' + m + ':' + String(r).padStart(2, '0');
}

/**
 * 解析行首時間並計算平移後秒數。
 * @returns {null|{ newSec: number, indent: string, quote: string, rest: string }}
 */
function analyzeLine(line, deltaSec) {
    // 時間後可為空白或與文字相連；四位數須在三位數之前（0129XXX）；下一字為數字則不算結束（避免 0570 誤判）
    const m = line.match(/^(\s*)(['\u2019]?)((?:\d{1,2}:\d{2})|(?:\d{4})|(?:\d{3}))(?=\D|$)/);
    if (!m) return null;
    const raw = m[3];
    const oldSec = parseTimeToken(raw);
    if (oldSec === null) return null;
    return {
        newSec: oldSec - deltaSec,
        indent: m[1],
        quote: m[2],
        rest: line.slice(m[0].length),
    };
}

function shiftLine(line, deltaSec) {
    const a = analyzeLine(line, deltaSec);
    if (!a) return null;
    return a.indent + a.quote + formatTimelineSeconds(a.newSec) + a.rest;
}

function processTimeline(text, targetSeconds) {
    const deltaSec = DEFAULT_FULL_SECONDS - targetSeconds;
    const lines = text.split(/\n/);
    const n = lines.length;
    const analyses = [];
    let i;
    for (i = 0; i < n; i++) {
        analyses[i] = analyzeLine(lines[i], deltaSec);
    }
    let firstNegIdx = -1;
    for (i = 0; i < n; i++) {
        if (analyses[i] !== null && analyses[i].newSec <= 0) {
            firstNegIdx = i;
            break;
        }
    }
    if (firstNegIdx === -1) {
        return lines
            .map(function (line) {
                const shifted = shiftLine(line, deltaSec);
                return shifted != null ? shifted : line;
            })
            .join('\n');
    }
    const out = [];
    for (i = 0; i < firstNegIdx; i++) {
        const a = analyses[i];
        if (a === null) {
            out.push(lines[i]);
        } else if (a.newSec >= 0) {
            out.push(a.indent + a.quote + formatTimelineSeconds(a.newSec) + a.rest);
        }
    }
    const firstNeg = analyses[firstNegIdx];
    const restTrim = firstNeg.rest.replace(/^\s+/, '');
    const problemTimeLabel =
        firstNeg.newSec === 0
            ? formatTimelineSeconds(0)
            : formatNegativeTimelineSeconds(firstNeg.newSec);
    out.push(
        firstNeg.indent +
            '[' +
            problemTimeLabel +
            ' 開不了] ' +
            restTrim
    );
    return out.join('\n');
}

module.exports = {
    name: 'shift',
    aliases: ['時間軸'],
    description: '依目標剩餘秒數平移 90 秒時間軸',
    async execute(message, args, userlist, chlist, gapi) {
        try {
            const rest = message.content.slice(1).trim();
            const cmdMatch = rest.match(/^(?:shift|時間軸)\s+/i);
            if (!cmdMatch) {
                message.reply('指令格式錯誤。');
                return;
            }
            const afterCmd = rest.slice(cmdMatch[0].length);
            const numMatch = afterCmd.match(/^(\d+)/);
            if (!numMatch) {
                message.reply('請指定目標剩餘秒數，例如: `!shift 88`');
                return;
            }
            const targetSeconds = parseInt(numMatch[1], 10);
            if (targetSeconds <= 0) {
                message.reply('目標秒數必須為正整數。');
                return;
            }
            let body = afterCmd.slice(numMatch[0].length).replace(/^[\s\u3000]+/, '');
            if (body.startsWith('\n')) body = body.slice(1);

            if (!body.trim()) {
                message.reply(
                    '請在指令後貼上時間軸內容，例如:\n```\n!shift 88\n【開場】\n111 聖萊 → …\n```'
                );
                return;
            }

            const out = processTimeline(body, targetSeconds);
            const header = '<@' + message.author.id + '>, 剩餘 ' + targetSeconds + ' 秒的時間軸:';
            const payload = header + '\n```\n' + out + '\n```';
            message.channel.send(payload);
        } catch (err) {
            console.log(err.message + ' : ' + message.author.username + ':' + message.content);
            console.log(err);
            message.reply('錯誤訊息: ' + err.message);
        }
    },
};
