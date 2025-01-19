import '@/app/globals.css'

export default function AuthLayout({
	children,
  }: {
	children: React.ReactNode
  }) {
	return (
	  <div className="min-h-screen w-full">
		{children}
	  </div>
	)
  }