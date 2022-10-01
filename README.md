# nginx-multiplexer
TCP  and TLS-alpn multiplexer  by nginx



## 1.  TCP  multiplexer.
    Using nginx script to run multiple tcp protocols at the same port:  http, ssl, and ssh.
    ```
    # In file: /etc/nginx/nginx.conf
    
    #load nginx script module
    load_module modules/ngx_stream_js_module.so;
    load_module modules/ngx_http_js_module.so;
    
    http {
      #The real  http server listen at 80
      listen 80;
      ....
      
      #The real  https server listens at 8443
      listen 8443 ssl;
      ....
    }
    
    
    stream { 
      
      #Inport the js file first
      js_import /etc/nginx/stream.d/mul.js;
      
      
      server {
          # Them multiplexer listens at the public 443 port
          listen 443;
          resolver 1.1.1.1 8.8.8.8  valid=300s;

          set $upstream "127.0.0.1:8443"; #default to loacalhost 8443

          js_preread mul.preread;

          proxy_pass $upstream;
      }

    }
    
    
    ```
    
    
## 2.  TLS-alpn multiplexer
    See: [alpn.30443.conf](alpn.30443.conf)
    
    
    
    
