import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type CounterState = {
  value: number
  step: number
}

const initialState: CounterState = {
  value: 0,
  step: 1,
}

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment(state) {
      state.value += state.step
    },
    decrement(state) {
      state.value -= state.step
    },
    setStep(state, action: PayloadAction<number>) {
      state.step = action.payload
    },
    reset() {
      return initialState
    },
  },
})

export const { increment, decrement, setStep, reset } = counterSlice.actions
export const counterReducer = counterSlice.reducer

