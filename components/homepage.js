import { useState, useEffect } from 'react'

export default function Homepage() {

    const [divisor, setDivisor] = useState("")
    const [divisorBits, setDivisorBits] = useState([])
    const [dividend, setDividend] = useState("")
    const [dividendBits, setDividendBits] = useState([])
    const [quotients, setQuotients] = useState([])
    const [remainders, setRemainders] = useState([])
    const [started, setStarted] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [invalid, setInvalid] = useState(false)

    function checkBits() {
        let dividendBits = dividend.toString(2)
        let divisorBits = divisor.toString(2)

        if (dividendBits.length > 16 || divisorBits.length > 16) {
            setInvalid(true)
            setDisabled(true)
        } else
            handleDivision()
    }

    function handleDivision() {
        setDisabled(true);
        setStarted(true);
        setDivisorBits([])
        setDividendBits([])
        setQuotients([])

        if (divisor && dividend) {
            let q = 0
            let r = 0
            for (let bit of dividend.toString(2)) {
                r = (r << 1) + (bit == 1 ? 1 : 0)

                if (r < divisor)
                    setQuotients((quotients) => [...quotients, (q << 1)])
                else {
                    r -= divisor
                    setQuotients((quotients) => [...quotients, ((q << 1) + 1)])
                }
            }
            setDividendBits((dividendBits) => [...dividendBits, dividend.toString(2)])
            setDivisorBits((divisorBits) => [...divisorBits, divisor.toString(2)])
        }
    }

    function handleReset() {
        setDisabled(false)
        setStarted(false)
        setDivisor("")
        setDividend("")
        setInvalid(false)
    }

    return(
        <div className="flex flex-row p-8 w-screen">
            <div className="flex flex-col w-1/3">

                <input
                    id="dividend"
                    className="focus:outline-blue-100 mb-4 w-full" 
                    placeholder="Enter Dividend"
                    type="number"
                    value={dividend}
                    onChange={(e) => setDividend(Number(e.target.value))}
                    disabled={disabled}>
                </input>

                <input
                    id="divisor"
                    className="focus:outline-blue-100 w-full" 
                    placeholder="Enter Divisor"
                    type="number"
                    value={divisor}
                    onChange={(e) => setDivisor(Number(e.target.value))}
                    disabled={disabled}>
                </input>

                {(divisor && dividend) ?
                    <div>
                        <button 
                            className={`flex justify-center mt-4 w-full rounded-lg ${disabled ? "bg-gray-200" : "bg-sky-200" }`}
                            onClick={checkBits} disabled={disabled}>
                            Start Non-Restoring Division
                        </button>

                        { (started || invalid) &&
                            <button className="flex justify-center mt-4 bg-sky-200 w-full rounded-lg" 
                            onClick={handleReset}>
                                Reset
                            </button>
                        }
                    </div>
                    :
                    <h2 className="font-bold mt-4 text-red-500"> Enter a divisor and dividend!</h2>
                }

            </div>

            <div className="flex flex-col w-2/3 ml-12">
                { started &&
                    <div>
                        <div>
                            <h2 className="mb-4">Dividend: {dividendBits[0]}</h2>
                            <h2 className="mb-4">Divisor: {divisorBits[0]}</h2>

                            {quotients.length > 0 &&
                                quotients.map((q, index) => {
                                    return (
                                        <h2 className="mb-4"> Q{index+1}: {q} </h2>
                                    )   
                                })
                            }
                        </div>
                    </div>
                }

                {invalid && (
                    <h2 className="font-bold text-red-500"> Error: Input values should have less than 16 bits!</h2>
                )}
            </div>

        </div>
    )
}