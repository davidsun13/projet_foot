import canon from '../assets/télécharger.jpg'
function Header() {
  return (
    <header className="relative w-full bg-red-600 text-white sticky top-0 z-50 h-20 md:h-24">
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <img src={canon} alt="Logo" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-center h-full px-8">
        <div className="text-2xl md:text-3xl font-bold">
        </div>
      </div>
    </header>
  );
}

export default Header;
