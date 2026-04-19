const UPDATE_USER_SCHEMA = Object.freeze({
    username: { type: "string", min: 2, max: 255 },
    email: { type: "email" },
    description: { type: "string", max: 500 },
})

export default UPDATE_USER_SCHEMA;