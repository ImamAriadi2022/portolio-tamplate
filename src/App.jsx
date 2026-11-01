import DataImage from "./data";
function App() {
  return (
    <>
   <div className= "hero grid grid-cols-2 items-centerpt-10"> 
    <div>
      <div className="flex items-center gap-3 mb-6 bg-zinc-800 w-fit p-4 rounded-2xl">
        <img src={DataImage.HeroImage} alt= "Hero Image" className= "w-10 rounded-md" />
        <q> Kode Indah lahir dari ketekunan.</q>
      </div>
      <h1 className= "text-5xl/tight font-bold mb-6"> Hi, Saya Zabrina Talitha Anindya</h1>
      <p className= "text-base/loose mb-6 opacity-50"> Halo gais</p>
      <div className="flex items-center gap-4">
        <a href= "#" className="bg-violet-700 p-4 rounded-2xl hover:bg-violet-600">
          Donwload CV <i className="ri-download-line ri-lg"></i></a>
        <a href= "#" className="bg-zinc-700 p-4 rounded-2xl hover:bg-zinc-600">
          Lihat Proyek <i className="ri-arrow-down-line ri-lg"></i></a>
      </div>
    </div>
    <img src={DataImage.HeroImage} alt= "Hero Image" className= "w-[500px] ml-auto" />
   </div>
    </>
  )
}

export default App
