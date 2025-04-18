import { MdOutlineRemoveRedEye } from "react-icons/md";
const Header = () => {
  return (
    <header className="bg-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="pr-6 border-r-2 border-gray-200">
            <img src="/wempro_logo.png" alt="Logo" className="w-11 h-11 " />
          </div>
          <div>
            <h1 className="text-lg font-semibold ">Form Builder</h1>
            <p className="text-sm text-[#636366] font-medium">
              Add and customize forms for your needs
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-sm text-[#636366] font-medium mr-2">
            Changes saved 2 mins ago
          </span>
          <button className="bg-[#E8EDF4]  w-10 h-10 rounded-xl flex items-center justify-center">
            <MdOutlineRemoveRedEye className="w-5 h-5 text-[#1C51B8" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
