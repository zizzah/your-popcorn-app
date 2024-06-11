
const CurrencyConverter = () => {
  return (
    <div>
        <h1 className=" items-center align-middle">CURRENCY CONVERTER </h1>
        <div className=" flex justify-normal items-start flex-col  p-7 bg-slate-50 mb-8">
              <input type="text"  className=" border " />
<div className=" p-6 m-10 bg-orange-400">
   <select className=" bg-slate-400 h-14 flex-1 p-4">
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>

      </div>
      </div>
      <p className=" bg-orange-400">OUTPUT</p>



    </div>
  )
}

export default CurrencyConverter