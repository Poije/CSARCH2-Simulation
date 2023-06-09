import { useState, useEffect, useRef } from 'react'

export default function Homepage() {

    const [divisor, setDivisor] = useState("")
    const [divisorBits, setDivisorBits] = useState("")
    const [dividend, setDividend] = useState("")
    const [dividendBits, setDividendBits] = useState("")
    const [passes, setPasses] = useState([])
    const [stepIndex, setStepIndex] = useState(1)
    const [decimalMode, setDecimalMode] = useState(true)
    const textRef = useRef(null)

    const [started, setStarted] = useState(false)
    const [showAll, setShowAll] = useState(false)
    const [showSteps, setShowSteps] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [invalid, setInvalid] = useState(false)
    const [validBinary, setValidBinary] = useState(true)
    const [validUnsign, setUnsigned] = useState(true)

    function checkBits() {
        if (decimalMode) {
            if (dividend.toString(2).length > 16 || divisor.toString(2).length > 16) {
                setInvalid(true)
                setDisabled(true)
            } 
            else if(dividend<0 ||divisor<0){
                setUnsigned(false)
                setDisabled(true)
            }
            else {
                let mostBits = Math.max(dividend.toString(2).length, divisor.toString(2).length)
                // initialize dividend & divisor before starting
                setDividendBits(dividend.toString(2).padStart(mostBits, 0))
                setDivisorBits(divisor.toString(2).padStart(mostBits+1, 0))
                setDisabled(true)
                setStarted(true)
            }
        }
        else if (!decimalMode) {
            const regex = /^[01]+$/
            if (dividend.toString().length > 16 || divisor.toString().length > 16) {
                setInvalid(true)
                setDisabled(true)
            } 
            else if (!regex.test(divisor.toString()) || !regex.test(dividend.toString())) {
                setValidBinary(false);
                setDisabled(true)
            }
            else {
                setDividend(parseInt(dividend.toString(), 2))
                setDivisor(parseInt(divisor.toString(), 2))
                let mostBits = Math.max(dividend.toString().length, divisor.toString().length)
                setDividendBits(dividend.toString().padStart(mostBits, 0))
                setDivisorBits(divisor.toString().padStart(mostBits+1, 0))
                setDisabled(true)
                setStarted(true)
            }
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
        setValidBinary(true)
        setUnsigned(true)
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
        <div className="flex flex-row p-10 w-screen">
            <div className="flex flex-col w-2/3 ">

                <div className="flex flex-row gap-4 justify-start p-2 mb-4">
                    <button
                    className={`flex justify-center rounded-lg p-0.5 w-full ${(decimalMode && !disabled) ? "bg-sky-200" : "bg-red-300" } ${disabled ? "bg-gray-300" : ""}`}
                    onClick={() => setDecimalMode(true)}
                    disabled={disabled}>
                        Decimal Input
                    </button>

                    <button
                    className={`flex justify-center rounded-lg p-0.5 w-full ${(!decimalMode && !disabled) ? "bg-sky-200" : "bg-red-300" } ${disabled ? "bg-gray-300" : ""}`}
                    onClick={() => {
                        setDecimalMode(false)
                    }}
                    disabled={disabled}>
                        Binary Input
                    </button>
                </div>

                <input
                    id="dividend"
                    className="focus:outline-blue-100 mb-4 w-full" 
                    placeholder="Enter Dividend"
                    type={decimalMode ? "number" : "text"}
                    value={dividend}
                    onChange={(e) => {decimalMode ? setDividend(Number(e.target.value)) : setDividend(e.target.value)}}
                    disabled={disabled}>
                </input>

                <input
                    id="divisor"
                    className="focus:outline-blue-100 w-full" 
                    placeholder="Enter Divisor"
                    type={decimalMode ? "number" : "text"}
                    value={divisor}
                    onChange={(e) => {decimalMode ? setDivisor(Number(e.target.value)) : setDivisor(e.target.value)}}
                    disabled={disabled}>
                </input>

                {(divisor && dividend) ?
                    <div>
                        <button 
                            className={`flex justify-center mt-4 w-full rounded-lg p-0.5 ${disabled ? "bg-gray-300" : "bg-sky-200" }`}
                            onClick={checkBits} disabled={disabled}>
                            Start Non-Restoring Division
                        </button>

                        { (started || invalid || !validBinary|| !validUnsign) &&
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
                            <div className="flex flex-col gap-4 mb-4">
                                <h2> ---------------INITIALIZE----------------- </h2>
                                <h2> Dividend: {dividendBits} Divisor: {divisorBits} </h2>
                                <h2> A: {passes[0].A} Q: {passes[0].Q} </h2>
                                <h2> ------------------------------------------ </h2>
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
                                                            <h2 className="mb-4" key={index}> A: {pass.A} Q: {pass.Q} Pass {index}</h2>
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
                                                <h2 className="mb-4" key={index}> A: {pass.A} Q: {pass.Q} Pass {index+1}</h2>
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
                {!validUnsign && (
                    <h2 className="font-bold text-red-500"> Error: Values should be unsigned!</h2>
                )}
                {!validBinary && (
                    <h2 className="font-bold text-red-500"> Error: Binary values should only contain 1s and 0s!</h2>
                )}
            </div>

        </div>
    )
}