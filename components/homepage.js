import { useState, useEffect, useRef } from 'react'

export default function Homepage() {

    const [divisor, setDivisor] = useState("")
    const [divisorBits, setDivisorBits] = useState("")
    const [dividend, setDividend] = useState("")
    const [dividendBits, setDividendBits] = useState("")
    const [passes, setPasses] = useState([])
    const [stepIndex, setStepIndex] = useState(1)
    const textRef = useRef(null)

    const [started, setStarted] = useState(false)
    const [showAll, setShowAll] = useState(false)
    const [showSteps, setShowSteps] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [invalid, setInvalid] = useState(false)

    function checkBits() {
        let dividendBits = dividend.toString(2)
        let divisorBits = divisor.toString(2)

        if (dividendBits.length > 16 || divisorBits.length > 16) {
            setInvalid(true)
            setDisabled(true)
        } else {
            let mostBits = Math.max(dividend.toString(2).length, divisor.toString(2).length)
            // initialize dividend & divisor before starting
            setDividendBits(dividend.toString(2).padStart(mostBits, 0))
            setDivisorBits(divisor.toString(2).padStart(mostBits+1, 0))
            setDisabled(true)
            setStarted(true)
        }
    }

    useEffect(() => {
        if (started) {
            let passList = []
            if (divisorBits && dividendBits) {
                let q = dividendBits
                let r = 0
                let rString = ""
                let difference = 0
                
                for (let i = 0; i < dividendBits.length; i++) {
                    if (r < 0) // get twos complement of r binary string
                        rString = twosComplementConverter(r)
                    else
                        rString = r.toString(2).padStart(divisorBits.length , "0")
    
                    //console.log("Q: " + q)
                    //console.log("A: " + rString)
                    passList.push({Q: q, A: rString})
    
                    rString = rString.slice(1)
                    //console.log("Rstring after slice: " + rString)
                    rString = rString + (dividendBits[i])
                    //console.log("Rstring after slice and append: " + rString)
                    //r = (r << 1) + Number(dividendBits[0][i]);
                    r = BinaryToSignedInt(rString)
                    
    
                    if (Number(rString[0]) ==  0){
                        difference = r - divisor
    
                    }
                    else{
                        difference = r + divisor
                    }
                    q = q.slice(1);
                    if (difference < 0){
                        q = q + "0"
                    }
                    else{
                        q = q + "1"
                    }
    
                    r = difference
                    
                    //console.log("Quotient: " + q)
                }
    
                if (r < 0){
                    // Print to say Restore R by doing A + Divisor
                    rString = twosComplementConverter(r)
                    r = BinaryToSignedInt(rString)
                    r = r + divisor
                    rString = r.toString(2).padStart(divisorBits.length , "0")
                    //console.log("Final Q: " + q)
                    //console.log("Final A: " + rString)
                    passList.push({Q: q, A: rString})
                    
                }
                else {
                    rString = r.toString(2).padStart(divisorBits.length , "0")
                    //console.log("Final Q: " + q)
                    //console.log("Final A: " + rString)
                    passList.push({Q: q, A: rString})
                }
            }
            setPasses(passList)
        }
    }, [started])
    
    function twosComplementConverter(number){
        number = Math.abs(number);
        //console.log(number)
        const BinaryString = number.toString(2).padStart(divisorBits.length, "0");
        //console.log("BinaryString: " + BinaryString)
        const BinaryArray = BinaryString.split("");
        const flippedArray = BinaryArray.map((bit) => (bit == 1 ? 0 : 1))
        const flippedString = flippedArray.join("")
        const flippedDecimal = parseInt(flippedString, 2) + 1
        return flippedDecimal.toString(2).padStart(divisorBits.length, "0")
    }

    function BinaryToSignedInt(binaryString){
        if (binaryString[0] == 0)
            return parseInt(binaryString, 2)
        else{
            const flippedArray = binaryString.split("").map((bit) => (bit == 1 ? 0 : 1))
            const flippedString = flippedArray.join("")
            const flippedDecimal = parseInt(flippedString, 2) + 1
            return flippedDecimal * -1
        }
    }
    
    function handleReset() {
        setDisabled(false)
        setStarted(false)
        setInvalid(false)
        setShowAll(false)
        setShowSteps(false)
        setDivisor("")
        setDividend("")
        setDividendBits("")
        setDivisorBits("")
        setPasses([])
        setStepIndex(1)
    }

    function handleExport() {
        const element = document.createElement("a")
        const file = new Blob([textRef.current.innerText], {type: 'text/plain'})
        element.href = URL.createObjectURL(file)
        element.download="simulation-output.txt"
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
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
                            className={`flex justify-center mt-4 w-full rounded-lg p-0.5 ${disabled ? "bg-gray-200" : "bg-sky-200" }`}
                            onClick={checkBits} disabled={disabled}>
                            Start Non-Restoring Division
                        </button>

                        { (started || invalid) &&
                            <button className="flex justify-center mt-4 bg-sky-200 w-full rounded-lg p-0.5" 
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
                { (started && !invalid && passes.length > 0) && 
                    <div className="flex flex-col">
                        <div className="flex flex-col" ref={textRef}>
                            <div className="flex flex-row gap-4 mb-4">
                                <h2> Initialize: Dividend: {dividendBits} Divisor: {divisorBits} A: {passes[0].A} </h2>
                            </div>
                                
                            {(!showAll && !showSteps) &&
                                <div className="flex gap-4">
                                    <button 
                                    className="flex justify-center bg-sky-200 rounded-lg p-0.5"
                                    onClick={() => setShowAll(true)}> 
                                        Show All 
                                    </button>

                                    <button 
                                    className="flex justify-center bg-sky-200 rounded-lg p-0.5"
                                    onClick={() => setShowSteps(true)}> 
                                        Show Steps 
                                    </button>
                                </div>
                            }

                            {showAll &&
                                <div className="flex flex-col">
                                    <div className="flex flex-row gap-4">
                                        <div>
                                            {(passes.length > 0) &&
                                                passes.map((pass, index) => {
                                                    if (index > 0)
                                                        return (
                                                            <h2 className="mb-4" key={index}>Pass {index} A: {pass.A} Q: {pass.Q}</h2>
                                                        )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            }

                            {showSteps &&
                                <div className="flex flex-col gap-4">
                                    <div>
                                        {(passes.length > 0) &&
                                            passes.slice(1, stepIndex).map((pass, index) => (
                                                <h2 className="mb-4" key={index}>Pass {index+1} A: {pass.A} Q: {pass.Q}</h2>
                                            ))
                                        }
                                    </div>
                                    
                                    <div className="-mt-4">
                                        {stepIndex < passes.length &&
                                            <div>
                                                <button 
                                                className="flex justify-center bg-sky-200 rounded-lg p-0.5"
                                                onClick={() => setStepIndex(stepIndex+1)}>
                                                    Show Next Pass
                                                </button>
                                            </div>
                                        }
                                    </div>

                                </div>
                            }
                        </div>
                        
                        {(showAll || (stepIndex >= passes.length)) &&
                            <button className="flex justify-center bg-sky-200 rounded-lg h-fit w-fit p-0.5" 
                            onClick={handleExport}>
                                Export to Text File
                            </button> 
                        }

                    </div>

                }

                {invalid && (
                    <h2 className="font-bold text-red-500"> Error: Input values should have less than 16 bits!</h2>
                )}
            </div>

        </div>
    )
}