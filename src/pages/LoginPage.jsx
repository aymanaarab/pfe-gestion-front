import LoginForm from '../components/LoginForm'

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-200 p-4">
      <div className="relative w-full max-w-[1200px] min-h-[500px] lg:min-h-[600px] flex flex-col bg-white shadow-2xl overflow-hidden lg:flex-row">
        <div className="relative w-full lg:w-1/2 h-48 sm:h-64 lg:h-auto">
          <img
            src="/semlalia-bg.jpg"
            alt="Student studying"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center lg:hidden bg-green-700/20 bg-opacity-40">
            <img
              src="/semlalia-logo-rbg.png"
              alt="Semlalia Logo"
              className="w-24 sm:w-72 h-auto"
            />
          </div>
        </div>

        <div className="flex flex-col w-full lg:w-1/2 justify-center items-center p-6 sm:p-8 lg:p-12">
          <div className="hidden lg:block mb-6">
            <img
              src="/semlalia-logo-rbg.png"
              alt="Semlalia Logo"
              className="w-36 xl:w-44 h-auto mx-auto"
            />
          </div>

          <div className="w-full max-w-md">
            <h1 className="mb-2 text-2xl font-bold text-center">
              PLATFORME<span className="text-green-700"> PFE GESTION</span>
            </h1>
            <p className="font-light text-gray-400 text-sm sm:text-base text-center mb-6 lg:mb-8">
              Connectez-vous avec votre email et mot de passe
            </p>

            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
