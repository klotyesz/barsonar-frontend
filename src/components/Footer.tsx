import "../style/footer.css"

export function Footer() {
  return (
    <>
      <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4">
        <p className="col-md-4 mb-0 text-body-primary" id="copyright">© 2026 BarSonar</p>
        <a
          href="/"
          className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
          aria-label="Bootstrap"
        >
          <img src="/logo.svg" alt="BarSonar" className="logo"/>
        </a>
        
      </footer>
    </>
  );
}
