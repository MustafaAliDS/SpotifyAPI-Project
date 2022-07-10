import { server } from "./server";

const { PORT } = process.env

server.listen(PORT, () => {
    console.log(`Working on port ${PORT ?? 3000}`)
})
