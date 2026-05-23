import {
    format,
    subDays,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval
} from 'date-fns';

export const toDateKey = (date) => format(date, 'yyyy-MM-dd');

export const todayKey = () => toDateKey(new Date());

export const parseDateKey = (key) => {
    const [y, m, d] = key.split('-').map(Number);
    return new Date(y, m - 1, d);
};

export const last90Days = () => {
    const end = new Date();
    const start = subDays(end, 89);
    return eachDayOfInterval({ start, end }).map(toDateKey);
};

export const currentWeekKeys = () => {
    const now = new Date();
    const start = startOfWeek(now, { weekStartsOn: 1 });
    const end = endOfWeek(now, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end }).map(toDateKey);
};

export const lastNDays = (n) => {
    const end = new Date();
    const start = subDays(end, n - 1);
    return eachDayOfInterval({ start, end }).map(toDateKey);
};

export const calcStreak = (sortedDateKeys) => {
    if (!sortedDateKeys.length) {
        return { current: 0, longest: 0 };
    }

    const set = new Set(sortedDateKeys);

    // --------------------
    // CURRENT STREAK
    // --------------------
    let current = 0;
    let cursor = new Date();

    while (set.has(toDateKey(cursor))) {
        current++;
        cursor = subDays(cursor, 1);
    }

    // --------------------
    // LONGEST STREAK
    // --------------------
    const sortedAsc = [...sortedDateKeys].sort(
        (a, b) => parseDateKey(a) - parseDateKey(b)
    );

    let longest = 0;
    let run = 0;
    let prev = null;

    for (const k of sortedAsc) {
        if (!prev) {
            run = 1;
        } else {
            const diff =
                (parseDateKey(k) - parseDateKey(prev)) /
                (1000 * 60 * 60 * 24);

            run = diff === 1 ? run + 1 : 1;
        }

        longest = Math.max(longest, run);
        prev = k;
    }

    return { current, longest };
};