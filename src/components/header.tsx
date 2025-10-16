import canon from '../assets/Canon.jpg'
function Header() {
  return (
    <header className="w-full bg-red-600 text-white sticky top-0 z-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <div className="text-xl font-bold">
          <img src={canon} alt="Logo" className="w-25 h-25" />
        </div>
      </div>
    </header>
  );
}

export default Header;
