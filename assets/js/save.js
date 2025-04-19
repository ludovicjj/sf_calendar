// const processedEvents = useMemo(() => {
//     // Init Map : Map([dayId][hour] => events[])
//     const eventsByDayAndHour = new Map();
//
//     // Init map with day and hour
//     daysOfWeek.forEach(day => {
//         const dayId = getDayId(day);
//         eventsByDayAndHour.set(dayId, new Map());
//
//         HOURS.forEach(hour => {
//             eventsByDayAndHour.get(dayId).set(hour, []);
//         });
//     })
//
//     // Handle Events
//     daysOfWeek.forEach(day => {
//         const dayId = getDayId(day);
//         const dayEvents = eventsMap.get(dayId) || [];
//
//         // Filtrer les événements qui ne sont pas sur plusieurs jours
//         const nonFullDayEvents = dayEvents.filter(event => !event.fullDay);
//         if (nonFullDayEvents.length === 0) return;
//
//         // Construire un graphe de chevauchement
//         const overlapGraph = {};
//         // Initialiser le graphe
//         nonFullDayEvents.forEach(event => {
//             const eventId = event.token || `${event.start}-${event.end}-${event.title}`;
//             overlapGraph[eventId] = {
//                 event: event,
//                 overlaps: []
//             };
//         });
//
//         for (let i = 0; i < nonFullDayEvents.length; i++) {
//             const event1 = nonFullDayEvents[i];
//             const event1Id = event1.token || `${event1.start}-${event1.end}-${event1.title}`;
//             const start1 = new Date(event1.start);
//             const end1 = new Date(event1.end);
//
//             for (let j = i + 1; j < nonFullDayEvents.length; j++) {
//                 const event2 = nonFullDayEvents[j];
//                 const event2Id = event2.token || `${event2.start}-${event2.end}-${event2.title}`;
//                 const start2 = new Date(event2.start);
//                 const end2 = new Date(event2.end);
//
//                 // Vérifier si les événements se chevauchent
//                 if (start1 < end2 && start2 < end1) {
//                     overlapGraph[event1Id].overlaps.push(event2Id);
//                     overlapGraph[event2Id].overlaps.push(event1Id);
//                 }
//             }
//         }
//
//         // Appliquer l'algorithme de coloration de graphe (assignation de colonnes)
//         const columns = {};
//         const assigned = new Set();
//
//         // Trier les événements par nombre de chevauchements décroissant
//         const eventsSortedByOverlaps = Object.keys(overlapGraph).sort((a, b) => {
//             return overlapGraph[b].overlaps.length - overlapGraph[a].overlaps.length;
//         });
//
//         // Attribuer des colonnes aux événements
//         eventsSortedByOverlaps.forEach(eventId => {
//             if (assigned.has(eventId)) return;
//
//             // Trouver la première colonne disponible
//             let column = 0;
//             const usedColumns = new Set();
//
//             // Vérifier les colonnes utilisées par les événements qui se chevauchent
//             overlapGraph[eventId].overlaps.forEach(overlapId => {
//                 if (assigned.has(overlapId)) {
//                     usedColumns.add(columns[overlapId]);
//                 }
//             });
//
//             // Trouver la première colonne non utilisée
//             while (usedColumns.has(column)) {
//                 column++;
//             }
//
//             columns[eventId] = column;
//             assigned.add(eventId);
//         });
//
//         // Calculer le nombre maximum de colonnes par groupe
//         const maxColumns = Math.max(...Object.values(columns), 0) + 1;
//
//         // Placer les événements dans le calendrier
//         Object.keys(overlapGraph).forEach(eventId => {
//             const event = overlapGraph[eventId].event;
//             const columnIndex = columns[eventId];
//
//             const eventStart = new Date(event.start);
//             const eventEnd = new Date(event.end);
//
//             const startHour = eventStart.getHours();
//             const endHour = eventEnd.getHours() + (eventEnd.getMinutes() > 0 ? 1 : 0);
//
//             for (let hour = startHour; hour < Math.min(endHour, 24); hour++) {
//                 const startsInThisHour = hour === startHour;
//                 const endsInThisHour = hour === eventEnd.getHours() ||
//                     (hour === eventEnd.getHours() - 1 && eventEnd.getMinutes() === 0);
//
//                 eventsByDayAndHour.get(dayId).get(hour).push({
//                     ...event,
//                     eventId,
//                     startsInThisHour,
//                     endsInThisHour,
//                     continuesFromPreviousHour: hour > startHour,
//                     continuesToNextHour: hour < endHour - 1,
//                     columnIndex,
//                     totalColumns: maxColumns
//                 });
//             }
//         });
//     });
//
//     return eventsByDayAndHour;
// }, [daysOfWeek, eventsMap]);


// -----------------------------------------------
//
// const occupiedHours = [];
// for (let hour = startHour; hour <= endHour; hour++) {
//     // Un événement qui se termine à X:00 n'est pas visible dans l'heure X
//     if (hour === endHour && endMinutes === 0) continue;
//     occupiedHours.push(hour);
// }
//
// // lundi - 1 (3h-5h15) : Position 0
// // lundi - 2 (4h-6h30) : Position 1
// // lundi - 3 (6h20-9h30) : Position 2
// // lundi - 4 (12h-12h30) : Position 0
//
// console.log(`${event.title} occuped this hours`, occupiedHours)
// let position = 0;
// let positionFound = false;
//
// while (!positionFound) {
//     positionFound = true;
//
//     // Vérifier si cette position est libre pour toutes les heures occupées
//     for (const hour of occupiedHours) {
//         if (hourPositionsMap[hour].has(position)) {
//             positionFound = false;
//             position++;
//             break;
//         }
//     }
// }
//
// console.log(`map hourPosition`, hourPositionsMap)
//
// // Marquer cette position comme occupée pour toutes les heures concernées
// for (const hour of occupiedHours) {
//     hourPositionsMap[hour].add(position);
// }
//
// // Ajouter l'événement aux cellules horaires appropriées
// for (const hour of occupiedHours) {
//     const startsInThisHour = hour === startHour;
//
//     eventsByDayAndHour.get(dayId).get(hour).push({
//         ...event,
//         startsInThisHour,
//         position
//     });
// }
// })


// ----
// import {useMemo} from "react";
// import {getDayId} from "../react/utils/dateUtils";
//
// const processedEvents = useMemo(() => {
//     // Init Map : Map([dayId][hour] => events[])
//     const eventsByDayAndHour = new Map();
//
//     // Init map with day and hour
//     daysOfWeek.forEach(day => {
//         const dayId = getDayId(day);
//         eventsByDayAndHour.set(dayId, new Map());
//
//         HOURS.forEach(hour => {
//             eventsByDayAndHour.get(dayId).set(hour, []);
//         });
//     })
//
//     daysOfWeek.forEach(day => {
//         const dayId = getDayId(day);
//         const dayEvents = eventsMap.get(dayId) || [];
//
//         const nonFullDayEvents = dayEvents.filter(event => !event.fullDay);
//         if (nonFullDayEvents.length === 0) return;
//
//         const hourPositionsMap = {};
//         HOURS.forEach(hour => {
//             hourPositionsMap[hour] = new Set();
//         });
//         nonFullDayEvents.forEach(event => {
//             const eventStart = event.start;
//             const eventEnd = event.end;
//
//             const startHour = eventStart.getHours();
//             const endHour = eventEnd.getHours() + (eventEnd.getMinutes() > 0 ? 1 : 0);
//
//             for (let hour = startHour; hour < Math.min(endHour, 24); hour++) {
//                 const startsInThisHour = hour === startHour;
//
//                 eventsByDayAndHour.get(dayId).get(hour).push({
//                     ...event,
//                     startsInThisHour,
//                 })
//             }
//         })
//     })
//     return eventsByDayAndHour;
// }, [daysOfWeek, eventsMap])
