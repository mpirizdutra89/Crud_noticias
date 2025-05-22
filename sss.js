---
- name: Desplegar y configurar una aplicación Node.js en VPS
  hosts: vps_production
  become: yes

  vars:
    # Estas variables serán definidas al ejecutar el comando ansible-playbook
     app_name: app-noticias # Nombre único para la aplicación en PM2 (ej. mi-app-web)
     app_repo: git@github.com:mpirizdutra89/Crud_noticias.git # URL SSH del repositorio Git (ej. git@github.com:usuario/repo.git)
     app_dir:  /var/www/apps/Crud_noticias
     app_port: 3001 # Puerto interno en el que la app Node.js escucha (ej. 3000)
     domain_name: noticias.mpirizdutra.site # Subdominio público para la app (ej. mi.dominio.com)
     admin_email: mpirizdutra@gmail.com # Email para Certbot (ej. contacto@dominio.com)
     db_host: localhost # Host de la base de datos (por defecto 'localhost')
     db_user: root # Usuario de la base de datos para la app
     db_password: reSUlu43ra # Contraseña de la base de datos para la app
     db_database: noticias # Nombre de la base de datos para la app
     jwt_secret: "nicol@.26.89" # ¡AJUSTA ESTO!


  tasks:
    - name: Asegurar que el directorio base de aplicaciones exista y tenga permisos
      ansible.builtin.file:
        path: /var/www/apps
        state: directory
        owner: mpd
        group: mpd
        mode: '0755'

    - name: Clonar el repositorio de la aplicación
      ansible.builtin.git:
        repo: "{{ app_repo }}"
        dest: "{{ app_dir }}"
        version: main # O la rama específica que quieras desplegar (ej. 'production')
        accept_hostkey: yes
      become_user: mpd

    - name: Instalar dependencias de Node.js (npm install)
      ansible.builtin.command: npm install --prefix "{{ app_dir }}"
      args:
        chdir: "{{ app_dir }}"
      become_user: mpd
      environment:
        # ¡AJUSTA LA VERSIÓN DE NODE.JS A LA QUE TENGAS INSTALADA EN TU VPS!
        PATH: "/home/mpd/.nvm/versions/node/v20.19.2/bin:{{ ansible_env.PATH }}"
        # Ejemplo: PATH: "/home/mpd/.nvm/versions/node/v18.20.0/bin:{{ ansible_env.PATH }}"

    - name: Crear o actualizar ecosystem.config.js para PM2
      ansible.builtin.template:
        src: templates/ecosystem.config.js.j2
        dest: "{{ app_dir }}/ecosystem.config.js"
        owner: mpd
        group: mpd
        mode: '0644'
      become_user: mpd

    - name: Reiniciar/Iniciar aplicación con PM2
      ansible.builtin.command: pm2 startOrRestart "{{ app_dir }}/ecosystem.config.js" --name "{{ app_name }}" --env production
      args:
        chdir: "{{ app_dir }}"
      become_user: mpd
      environment:
        # ¡AJUSTA LA VERSIÓN DE NODE.JS!
        PATH: "/home/mpd/.nvm/versions/node/v20.19.2/bin:{{ ansible_env.PATH }}"

    - name: Guardar la configuración de PM2 para persistencia
      ansible.builtin.command: pm2 save
      become_user: mpd
      environment: # ¡Asegúrate de que este 'environment' y el 'PATH' estén aquí!
        PATH: "/home/mpd/.nvm/versions/node/v20.19.2/bin:{{ ansible_env.PATH }}"

   - name: Configurar Nginx para la aplicación usando plantilla
     ansible.builtin.template:
        src: templates/nginx_app.conf.j2
        dest: "/etc/nginx/sites-available/{{ domain_name }}"
        owner: root
        group: root
        mode: '0644'
     notify: Reload Nginx

    - name: Crear enlace simbólico de Nginx (si no existe)
      ansible.builtin.file:
        src: "/etc/nginx/sites-available/{{ domain_name }}"
        dest: "/etc/nginx/sites-enabled/{{ domain_name }}"
        state: link
      notify: Reload Nginx

    - name: Obtener o renovar certificado SSL con Certbot
      ansible.builtin.command: "certbot --nginx -d {{ domain_name }} --non-interactive --agree-tos -m {{ admin_email }} --redirect"
      args:
        creates: "/etc/letsencrypt/live/{{ domain_name }}/fullchain.pem"
      notify: Reload Nginx

  handlers:
    - name: Reload Nginx
      ansible.builtin.systemd:
        name: nginx
        state: reloaded


^G Help           ^O Write Out      ^W Where Is       ^K Cut            ^T Execute        ^C Location       M-U Undo          M-A Set Mark      M-] To Bracket    M-Q Previous      ^B Back           ^◂ Prev Word      ^A Home
^X Exit