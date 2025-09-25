export default function Page() {
  return (
    <div className="flex h-screen items-center justify-center flex-col">
      <h2 className="font-bold text-[12rem] leading-[90%]">404</h2>
      <h2 className="font-bold text-4xl mb-3">Not Found</h2>
      <p className="mb-5">Could not find requested resource.</p>
      {/* <Link href="/" className="bg-primary py-2 px-10 text-primary-foreground rounded-md">
        Login
      </Link> */}
    </div>
  );
}
