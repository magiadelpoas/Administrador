import React, { useEffect } from 'react';

export const SidebarInitializer = () => {
  useEffect(() => {
    // Función para inicializar la funcionalidad del sidebar
    const initializeSidebar = () => {
      // Función para manejar el toggle del sidebar en desktop
      const handleSidebarToggle = (e) => {
        e.preventDefault();
        const sidebar = document.querySelector('.pc-sidebar');
        if (sidebar) {
          sidebar.classList.toggle('pc-sidebar-hide');
        }
      };

      // Función para manejar el toggle del sidebar en mobile
      const handleMobileSidebarToggle = (e) => {
        e.preventDefault();
        const sidebar = document.querySelector('.pc-sidebar');
        if (sidebar) {
          if (sidebar.classList.contains('mob-sidebar-active')) {
            // Cerrar sidebar
            sidebar.classList.remove('mob-sidebar-active');
          } else {
            // Abrir sidebar
            sidebar.classList.add('mob-sidebar-active');
          }
        }
      };

      // Función para cerrar el sidebar cuando se hace click fuera de él en mobile
      const handleClickOutside = (e) => {
        const sidebar = document.querySelector('.pc-sidebar');
        const mobileCollapseBtn = document.querySelector('#mobile-collapse');
        
        // Solo ejecutar en dispositivos móviles
        if (window.innerWidth <= 991.98) {
          // Verificar si el sidebar está abierto
          if (sidebar && sidebar.classList.contains('mob-sidebar-active')) {
            // Verificar si el click fue fuera del sidebar y no en el botón de toggle
            if (!sidebar.contains(e.target) && !mobileCollapseBtn?.contains(e.target)) {
              sidebar.classList.remove('mob-sidebar-active');
            }
          }
        }
      };

      // Agregar event listeners
      const sidebarHideBtn = document.querySelector('#sidebar-hide');
      const mobileCollapseBtn = document.querySelector('#mobile-collapse');

      if (sidebarHideBtn) {
        // Remover event listener anterior si existe
        sidebarHideBtn.removeEventListener('click', handleSidebarToggle);
        // Agregar nuevo event listener
        sidebarHideBtn.addEventListener('click', handleSidebarToggle);
      }

      if (mobileCollapseBtn) {
        // Remover event listener anterior si existe
        mobileCollapseBtn.removeEventListener('click', handleMobileSidebarToggle);
        // Agregar nuevo event listener
        mobileCollapseBtn.addEventListener('click', handleMobileSidebarToggle);
      }

      // Agregar event listener para cerrar sidebar al hacer click fuera
      document.addEventListener('click', handleClickOutside);

      // Cleanup function
      return () => {
        if (sidebarHideBtn) {
          sidebarHideBtn.removeEventListener('click', handleSidebarToggle);
        }
        if (mobileCollapseBtn) {
          mobileCollapseBtn.removeEventListener('click', handleMobileSidebarToggle);
        }
        document.removeEventListener('click', handleClickOutside);
      };
    };

    // Inicializar después de un pequeño delay para asegurar que el DOM esté listo
    const timeoutId = setTimeout(initializeSidebar, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return null; // Este componente no renderiza nada
};
