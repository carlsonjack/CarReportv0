export default function Footer() {
  return (
    <footer className="py-12 border-t">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <p className="text-sm text-gray-500">© 2025 CarReport. All rights reserved.</p>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

