interface State{
    maxTitleLength: number
    maxDescriptionLength: number
}

export const state:(() => State) = () => ({
    maxTitleLength: 20,
    maxDescriptionLength: 100
})

export const getters = {
    getMaxDescriptionLength: (state: State) => state.maxDescriptionLength,
    getMaxTitleLength: (state: State) => state.maxTitleLength
}