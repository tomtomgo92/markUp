import "./Footer.css";

import { ExternalLink, Info } from "lucide-react";

import { Logo } from "@thatmuch/designsystem";
import React from "react";

const Footer = React.memo(() => {
  return (
    <footer className="app-footer">
      <div className="container app-footer__inner">
        <div className="app-footer__grid">
          <div className="app-footer__col">
            <div className="app-footer__heading app-footer__heading--accent">
              <h4>
                <a
                  href="https://fromatflip.thatmuch.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  FormatFlip <ExternalLink size={16} />
                </a>
              </h4>
            </div>
            <p className="app-footer__text">
              Convertiseur d'images pour le web: WEBP ou AVIF.
            </p>
          </div>

          <div className="app-footer__col">
            <div className="app-footer__heading app-footer__heading--accent">
              <h4>
                <a
                  href="https://markup.thatmuch.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  MarkUp <ExternalLink size={16} />
                </a>
              </h4>
            </div>
            <p className="app-footer__text">
              Outil de chiffrage pour les freelances: TJM et marges.
            </p>
          </div>
        </div>

        <div className="app-footer__bottom">
          <p className="app-footer__copyright">
            © {new Date().getFullYear()} MarkUp — Propulsé par{" "}
            <a
              href="https://thatmuch.fr"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Logo src="https://cosmosdesign.thatmuch.fr/assets/logos/webp/THATMUCH_Logo_Color.webp" />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
