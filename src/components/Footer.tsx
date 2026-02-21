import { IconBrandGithubFilled } from "@tabler/icons-react";
import "../style/footer.css"

export function Footer() {
  return (
    <footer className="py-3 my-4">
      <div className="container">
        <div className="row align-items-center text-center text-md-start">

          <div className="col-12 col-md-4 mb-2 mb-md-0">
            <p className="mb-0" id="copyright">
              © 2026 BarSonar
            </p>
          </div>

          <div className="col-12 col-md-4 text-md-center">
            <a href="/" className="text-decoration-none">
              <img src="/logo.png" alt="BarSonar" className="logo" />
            </a>
          </div>

          <div className="col-12 col-md-4" id="github-link">
            <a href="https://github.com/klotyesz/barsonar-frontend" target="_blank" >
              <IconBrandGithubFilled stroke={2} />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}