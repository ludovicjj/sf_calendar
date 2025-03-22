const weekStartOn = 1
const msInDay = 86400000

/**
 * Trouve le nombre de jours en calendrier entre 2 dates
 * @param {Date} start
 * @param {Date} end
 * @return {number}
 */
export function diffInDay(start, end) {
    const a = new Date(start)
    a.setHours(0, 0, 0, 0)
    const b = new Date(end)
    b.setHours(23, 59, 59, 999)

    return Math.round((b.getTime() - a.getTime()) / msInDay)
}

/**
 * Trouve la date la plus loin dans le temps
 * @param {Date[]} dates
 */
export function minDates(dates) {
    if (dates.length === 0) {
        throw new Error("Impossible de trouver le minimum sans dates");
    }

    let min = dates[0];
    for (const date of dates) {
        if (date < min) {
            min = date;
        }
    }

    return min;
}


/**
 * Renvoie la date de fin de mois
 * @param {Date} date
 * @return {Date}
 */
export function endOfMonth(date) {
    const d = new Date(date)

    // ajoute un mois
    d.setMonth(d.getMonth() + 1)

    // positionne la date au dernier jour du mois précédent.
    d.setDate(0)
    d.setHours(23, 59, 59, 999)

    return d
}

/**
 * Renvoie un tableau de jours entre les deux dates
 * @param {Date} start
 * @param {Date} end
 * @return {Date[]}
 */
export function getDaysBetween(start, end) {
    if (start > end) {
        throw new Error('La date de debut ne peux pas être supérieur a la date de fin')
    }

    const days = [];
    let cursor = new Date(start)
    cursor.setHours(0, 0 , 0, 0)

    while (cursor < end) {
        days.push(cursor)
        cursor = addDays(cursor, 1)
    }

    return days
}

/**
 * Ajoute n jour(s) à une date
 * @param {Date} date
 * @param {number} n
 * @return {Date}
 */
export function addDays(date, n) {
    const d = new Date(date)
    d.setDate(d.getDate() + n)

    return d
}

/**
 * Renvoie la date du début de semaine
 * 0 - dimanche
 * 1 - lundi
 * 2 - mardi
 * 3 - mercredi
 * 4 - jeudi
 * 5 - vendredi
 * 6 - samedi
 *
 * Le premier jour du mois de février est un samedi (6).
 * Ll manque donc 5 jours pour arriver au premier jour de la semaine, c'est-à dire lundi (1).
 *
 * Si le premier jour du mois différent de dimanche, exemple : samedi
 *      0 + 6 - 1
 *      5 (il manque 5 jours pour aller à lundi)
 *
 * Si le premier jour du mois était un dimanche
 *      7 + 0 - 1
 *      6 (il manque 6 jours pour aller à lundi)
 *
 * @param {Date} date
 * @return {Date}
 */
export function startOfWeek(date) {
    const d = new Date(date)
    const day = d.getDay()
    const diff = (day < weekStartOn ? 7 : 0) + day - weekStartOn
    d.setDate(d.getDate() - diff)
    d.setHours(0, 0, 0, 0)

    return d
}

/**
 * Renvoie la date en fin de semaine
 * 0 - dimanche
 * 1 - lundi
 * 2 - mardi
 * 3 - mercredi
 * 4 - jeudi
 * 5 - vendredi
 * 6 - samedi
 * Le premier jour du mois de février est un samedi (6).
 * Il manque donc 1 jour pour arriver au dernier jour de la semaine (dimanche (0)).
 *
 * Si le jour donné est différent de dimanche, exemple : samedi
 *     0 + 6 - (6 - 1)
 *     0 + 6 - 5
 *     1 (il faut ajouter 1 jour pour aller jusqu'à dimanche)
 *
 * Si le jour donné est un dimanche
 *     -7 + 6 - (0 - 1)
 *     -1 - (-1)
 *     -1 + 1
 *     0 (il faut ajouter 0 jour pour aller jusqu'à dimanche)
 *
 *
 * @param {Date} date
 * @return {Date}
 */
export function endOfWeek(date) {
    const d = new Date(date)
    const day = d.getDay()

    const diff = (day < weekStartOn ? -7 : 0) + 6 - (day - weekStartOn)
    d.setDate(d.getDate() + diff)
    d.setHours(23, 59, 59, 999)

    return d
}

/**
 * Renvoie un identifiant pour un jour (YYYY-mm-dd)
 * @param {Date} date
 * @return {string}
 */
export function getDayId(date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

/**
 * Formate une date au format "dd-mm-yyyy HH:mm"
 * @param {Date} date
 * @return string
 */
export function formatDateToInputDateString(date) {
    if (!date) return "";

    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // getMonth() commence à 0
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}`;
}

export function formatInputDateStringToDate(dateString) {
    if (!dateString) {
        return null
    }

    // Convertit "DD-MM-YYYY H:i" en "YYYY-MM-DD H:i"
    const [datePart, timePart] = dateString.split(" ");
    const [day, month, year] = datePart.split("-");
    const [hours, minutes] = timePart ? timePart.split(":") : [];

    if (!day || !month || !year) {
        return null
    }

    if (!hours || !minutes) {
        return null;
    }

    const date = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);

    const isDateValid =
        date.getDate() === parseInt(day, 10) &&
        date.getMonth() + 1 === parseInt(month, 10) &&
        date.getFullYear() === parseInt(year, 10);

    // Vérifier si l'heure est valide
    const isTimeValid =
        parseInt(hours, 10) >= 0 && parseInt(hours, 10) < 24 &&
        parseInt(minutes, 10) >= 0 && parseInt(minutes, 10) < 60;

    // Retourner null si la date ou l'heure est invalide
    if (!isDateValid || !isTimeValid) {
        return
    }

    return date;
}

/**
 * Convertit une date "DD-MM-YYYY HH:mm" en objet Date valide "DD-MM-YYYY HH:mm:00"
 * @param {string} dateString
 * @return {Date}
 */
export function parseStringToDate(dateString) {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('-');

    return new Date(`${year}-${month}-${day}T${timePart}:00`);
}