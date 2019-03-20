export function isNotNumber(valueToConvert: string): boolean {
    return  !(!/^[0-9 ]*\.?[0-9 ]*$/.test(valueToConvert))
}

export function formatter(currency: string, value: number):number {
    const formatter = new Intl.NumberFormat('en-US', {
        currency: currency,
        minimumFractionDigits: 2,
    })
    return Number.parseFloat(formatter.format(value))
}