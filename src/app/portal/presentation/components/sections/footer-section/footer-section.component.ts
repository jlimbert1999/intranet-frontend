import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'footer-section',
  imports: [],
  template: `
    <footer class="bg-gray-900 text-gray-100 pt-12 pb-6">
      <div
        class="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8"
      >
        <div class="flex justify-center">
          <img
            src="images/institution/slogan.png"
            alt="Gobierno Autónomo Municipal de Sacaba"
            class="h-20 sm:h-24 mb-4 brightness-110"
          />
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-3 text-white">Enlaces útiles</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <a href="/" class="hover:text-sky-300 transition">Sitio Web</a>
            </li>
            <li>
              <a href="/transparencia" class="hover:text-sky-300 transition"
                >Transparencia</a
              >
            </li>
            <li>
              <a href="/comunicados" class="hover:text-sky-300 transition"
                >Comunicados</a
              >
            </li>
            <li>
              <a href="/directorio" class="hover:text-sky-300 transition"
                >Directorio institucional</a
              >
            </li>
          </ul>
        </div>

        <!-- Contacto -->
        <div class="lg:col-span-2">
          <h3 class="text-lg font-semibold mb-3 text-white">Contáctanos</h3>
          <ul class="space-y-2 text-sm text-gray-300">
            <li class="flex items-center">
              <i class="pi pi-map-marker text-sky-300 mr-2"></i>
              GAM-SACABA, CONSISTORIAL S-002, BOLIVIA
            </li>
            <li class="flex items-center">
              <i class="pi pi-phone text-sky-300 mr-2"></i>
              +(591) 4-4701677
            </li>
            <li class="flex items-center">
              <i class="pi pi-envelope text-sky-300 mr-2"></i>
              info@sacaba.gob.bo
            </li>
          </ul>
        </div>

        <!-- Redes sociales -->
        <div>
          <h3 class="text-lg font-semibold mb-3 text-white">Síguenos</h3>
          <div class="flex space-x-3">
            <a
              href="https://www.facebook.com/gob.municipal.sacaba"
              target="_blank"
              class="w-10 h-10 flex items-center justify-center rounded-full bg-sky-800 hover:bg-sky-700 transition"
            >
              <i class="pi pi-facebook text-xl"></i>
            </a>
            <a
              href="https://www.instagram.com/gamsacaba/"
              target="_blank"
              class="w-10 h-10 flex items-center justify-center rounded-full bg-sky-800 hover:bg-sky-700 transition"
            >
              <i class="pi pi-instagram text-xl"></i>
            </a>
            <a
              href="https://www.youtube.com/user/SACABACBBABO"
              target="_blank"
              class="w-10 h-10 flex items-center justify-center rounded-full bg-sky-800 hover:bg-sky-700 transition"
            >
              <i class="pi pi-youtube text-xl"></i>
            </a>
            <a
              href="https://x.com/gam_sacaba"
              target="_blank"
              class="w-10 h-10 flex items-center justify-center rounded-full bg-sky-800 hover:bg-sky-700 transition"
            >
              <i class="pi pi-twitter text-xl"></i>
            </a>
          </div>
        </div>
      </div>

      <div
        class="mt-10 px-2 border-t border-sky-800 pt-4 text-center text-sm text-gray-400"
      >
        © Gobierno Autónomo Municipal de Sacaba – Todos los derechos reservados.
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterSectionComponent {}
