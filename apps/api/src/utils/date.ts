import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"

dayjs.extend(utc)

export const now = () => dayjs.utc()
export const dateNow = () => now().toDate()
export const yesterday = () => dayjs.utc().subtract(1, "day")
export const dateYesterday = () => yesterday().toDate()
export const tomorrow = () => dayjs.utc().add(1, "day")
export const dateTomorrow = () => tomorrow().toDate()
