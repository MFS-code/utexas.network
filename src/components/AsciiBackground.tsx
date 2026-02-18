'use client';

export default function AsciiBackground() {
  const altState = `                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
     ⣤░░▒░░⣿⣷⣤⣀                                                                       ⣀⣤⣷⣿░░▒░░⣤    
     ⣤⣿⣿░▒▓█████▒⣿⣤⣀                                                              ⣤⣿▒▓████▓▒░⣿⣿⣀    
            ⣀⣷░▓████░⣷⣀                                                       ⣀⣤░▓███▓░⣷⣀           
                ⣤⣿▓████░⣷⣀                                                 ⣀⣷░████▓⣿⣀               
                   ⣤░█████░⣷⣀              ⣀⣀⣀⣀⣤⣤⣤⣤⣤⣤⣤⣀⣀⣀⣀              ⣀⣷░█████░⣤                  
                     ⣀⣿▓█████▓▒░⣿⣷⣷⣷⣷⣷⣿░░▓█████████████████▓░░⣿⣷⣷⣷⣷⣷⣿⣿▒▓█████▓⣿⣀                    
                       ⣀⣷▒█████████████████████████████████████████████████▒⣷⣀                      
                          ⣀⣷░▓█████████████████████████████████████████▓░⣷⣀                         
                               ⣀⣷▒█████████████████████████████████▒⣷⣀                              
                             ⣤▓███████████████████████████████████████▓⣤                            
                             ⣀⣿▒████▓░⣷⣿█████████████████████⣷⣷░▒▓███▒⣿⣀                            
                                       ⣀█████████████████████⣀                                      
                                        ⣷███████████████████⣤                                       
                                         ⣿█████████████████⣷                                        
                                          ░███████████████⣿                                         
                                           ░█████████████░                                          
                                           ⣀▓███████████▒⣀                                          
                                            ░███████████░                                           
                                           ⣿█████████████⣿                                          
                                           ▓█████████████▓                                          
                                           ⣀▒███████████▒⣀                                          
                                             ▒█████████░                                            
                                             ⣀⣷⣿⣿⣿⣿⣿⣿⣿⣷⣀                                            
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    `;

  return (
    <div className="ascii-art-background">
      <img src="/ascii-art.svg" alt="" aria-hidden="true" className="ascii-art-base" />
      <img src="/ascii-art.svg" alt="" aria-hidden="true" className="ascii-art-frame ascii-art-frame-2" />
      <img src="/ascii-art.svg" alt="" aria-hidden="true" className="ascii-art-frame ascii-art-frame-3" />
      <pre className="ascii-art-state ascii-art-state-4" aria-hidden="true">{altState}</pre>
    </div>
  );
}

