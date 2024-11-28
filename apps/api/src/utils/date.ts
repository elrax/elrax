import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import utc from "dayjs/plugin/utc"

dayjs.extend(utc)
dayjs.extend(relativeTime)

export const now = () => dayjs.utc()
export const dateNow = () => now().toDate()

export const toRelative = (v: Date) => dayjs.utc(v).fromNow()
