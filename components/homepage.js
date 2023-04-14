import { useState, useEffect } from 'react'

export default function Homepage() {

    const [divisor, setDivisor] = useState("")
    const [divisorBits, setDivisorBits] = useState([])
    const [dividend, setDividend] = useState("")
    const [dividendBits, setDividendBits] = useState([])
    const [quotients, setQuotients] = useState([])
    const [twosComplement, setTwosComplement] = useState("")
    const [remainderBits, setRemainderBits] = useState([])
    const [remainders, setRemainders] = useState("")
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
        setRemainders([])

        if (divisor && dividend) {
            setDividendBits((dividendBits) => [...dividendBits, dividend.toString(2).padStart(dividend.toString(2).length + 1, "0")])
            setDivisorBits((divisorBits) => [...divisorBits, divisor.toString(2).padStart(dividend.toString(2).length + 2, "0")])

            let q = dividendBits[0]
            let r = 0
            let rString = ""
            let difference = 0

            for (let i = 0; i < dividendBits[0].length; i++) {
                if (r < 0) // get twos complement of r binary string
                    rString = twosComplementConverter(r)
                else
                    rString = r.toString(2).padStart(divisorBits[0].length , "0")
                console.log("Q: " + q)
                console.log("A: " + rString)
                rString = rString.slice(1)
                //console.log("Rstring after slice: " + rString)
                rString = rString + (dividendBits[0][i])
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
                rString = r.toString(2).padStart(divisorBits[0].length , "0")
                console.log("Final Q: " + q)
                console.log("Final A: " + rString)
            }
            else {
                rString = r.toString(2).padStart(divisorBits[0].length , "0")
                console.log("Final Q: " + q)
                console.log("Final A: " + rString)
            }
           
           /* for (let bit of q.toString(2).padStart(dividend.toString(2).length + 1, "0")) {
                if (r > 0 ){
                    r = (r << 1) + (bit == 1 ? 1 : 0)
                    // add complement of divisor to r
                    r -= twosComplement
                    //if (r < 0)
                    //    q = (q << 1) + 0
                    //else
                    //    q = (q << 1) + 1
                }
                else{
                    r = (r << 1) + (bit == 1 ? 1 : 0)
                    // add divisor to r
                    r += divisor
                   // if (r < 0)
                    //   q = (q << 1) + 0
                    //else
                     //   q = (q << 1) + 1
                }
                
                
                if (r < divisor)
                    setQuotients((quotients) => [...quotients, (q)])
                else {
                    r -= divisor
                    setQuotients((quotients) => [...quotients, (q)])
                }

            } */
            
        }
    }

    function twosComplementConverter(number){
        number = Math.abs(number);
        //console.log(number)
        const BinaryString = number.toString(2).padStart(divisorBits[0].length, "0");
        //console.log("BinaryString: " + BinaryString)
        const BinaryArray = BinaryString.split("");
        const flippedArray = BinaryArray.map((bit) => (bit == 1 ? 0 : 1))
        const flippedString = flippedArray.join("")
        const flippedDecimal = parseInt(flippedString, 2) + 1
        return flippedDecimal.toString(2).padStart(divisorBits[0].length, "0")
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