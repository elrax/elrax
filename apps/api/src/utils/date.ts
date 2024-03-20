import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(utc)
dayjs.extend(relativeTime)

export const now = () => dayjs.utc()
export const dateNow = () => now().toDate()
export const yesterday = () => dayjs.utc().subtract(1, "day")
export const dateYesterday = () => yesterday().toDate()
export const tomorrow = () => dayjs.utc().add(1, "day")
export const dateTomorrow = () => tomorrow().toDate()

export const toRelative = (v: Date) => dayjs.utc(v).fromNow()
