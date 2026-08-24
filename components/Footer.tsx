export default function Footer() {
  return (
    <footer className="border-t border-[#262626] pt-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-neutral-500">
      <div>
        <p>&copy; {new Date().getFullYear()} Peter Olawale. All rights reserved.</p>
      </div>
      <div className="flex items-center gap-2"></div>
    </footer>
  );
}
