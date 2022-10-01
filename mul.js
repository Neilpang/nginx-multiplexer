

//https://github.com/nginx/njs-examples#choosing-upstream-in-stream-based-on-the-underlying-protocol-stream-detect-http




var upstreams = {
  
  //Use any valid domains(eg: www.google.com), or ip(12.35.26.3) or "127.0.0.1"
  //Or use unix socks:  unix:/etc/nginx/socks/alpn.8443.sock
  //but don't use string "localhost" here
  
  ssl: "127.0.0.1:8443"
  , ssh: "127.0.0.1:22"
  , http: "127.0.0.1:80"
  , default: "127.0.0.1:20001"  //other tcp connections

};


////////////////////////////////// don't modify the code bellow unless you know

function preread(s) {

  s.on('upstream', function(data, flags) {
    
    if (data.length) {

      if(upstreams.ssl && data[0] == 0x16 && data[1] == 0x03 && isSSL(data)) {
        s.variables.upstream = upstreams.ssl;
        s.done();
        return;
      }
      
      if(upstreams.ssh && data[0] == 0x53 && data[1] == 0x53 && data[2] == 0x48 && data[3] == 0x2d && isSSH(data)) {
        s.variables.upstream = upstreams.ssh;
        s.done();
        return;

      } 
      
      if(upstreams.http && isHTTP(data)) {
        s.variables.upstream = upstreams.http;
        s.done();
        return;
      }
      
      if(upstreams.default) {
        s.variables.upstream = upstreams.default;
        s.done();
        return;
      }
      

      s.done();
    }



    if(flags.last) {
      s.done();
    }

  });


}



function isSSL(data) {
  return true; //no more checks for now
  
}

function isSSH(data) {
  return true; //no more checks for now
  
  
}

function isHTTP(data) {
  switch(data[0]) {
    case 0x47: // 'G'
    {
      //'E' 'T'
      return data[1] == 0x45 && data[2] == 0x54 && data[3] == 0x20;
    }
    case 0x50: // 'P' 
    {
      //OST
      if( data[1] == 0x4f && data[2] == 0x53 && data[3] == 0x54 && data[4] == 0x20) {
        return true;
      }
      //UT
      return data[1] == 0x55 && data[2] == 0x54 && data[3] == 0x20;


    }
    case 0x44: // 'D'
    {
      //ELETE
      if( data[1] == 0x45 && data[2] == 0x4c && data[3] == 0x45 && data[4] == 0x54 && data[5] == 0x45 && data[6] == 0x20) {
        return true;
      }
      
    }
    case 0x55: // 'U'
    {
      //PDATE
      if( data[1] == 0x50 && data[2] == 0x44 && data[3] == 0x41 && data[4] == 0x54 && data[5] == 0x45 && data[6] == 0x20) {
        return true;
      }
      
    } 
    default: {
      return false;
    }
    
    
  }
  
}






export default { preread }