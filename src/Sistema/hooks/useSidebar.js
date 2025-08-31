import { useEffect } from 'react';

export const useSidebar = () => {
  useEffect(() => {
    // Función para manejar el toggle del sidebar en desktop
    const handleSidebarToggle = () => {
      const sidebar = document.querySelector('.pc-sidebar');
      if (sidebar) {
        sidebar.classList.toggle('pc-sidebar-hide');
      }
    };

    // Función para manejar el toggle del sidebar en mobile
    const handleMobileSidebarToggle = () => {
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

    // Agregar event listeners cuando el componente se monta
    const sidebarHideBtn = document.querySelector('#sidebar-hide');
    const mobileCollapseBtn = document.querySelector('#mobile-collapse');

    if (sidebarHideBtn) {
      sidebarHideBtn.addEventListener('click', handleSidebarToggle);
    }

    if (mobileCollapseBtn) {
      mobileCollapseBtn.addEventListener('click', handleMobileSidebarToggle);
    }

    // Agregar event listener para cerrar sidebar al hacer click fuera
    document.addEventListener('click', handleClickOutside);

    // Cleanup function para remover event listeners
    return () => {
      if (sidebarHideBtn) {
        sidebarHideBtn.removeEventListener('click', handleSidebarToggle);
      }
      if (mobileCollapseBtn) {
        mobileCollapseBtn.removeEventListener('click', handleMobileSidebarToggle);
      }
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return {
    toggleSidebar: () => {
      const sidebar = document.querySelector('.pc-sidebar');
      if (sidebar) {
        sidebar.classList.toggle('pc-sidebar-hide');
      }
    },
    toggleMobileSidebar: () => {
      const sidebar = document.querySelector('.pc-sidebar');
      if (sidebar) {
        if (sidebar.classList.contains('mob-sidebar-active')) {
          sidebar.classList.remove('mob-sidebar-active');
        } else {
          sidebar.classList.add('mob-sidebar-active');
        }
      }
    }
  };
};
