import React, {useEffect, useState} from "react";
import {invoke} from "@tauri-apps/api/core";
import ProcessCard from "./ProcessCard.tsx";
import './App.css';

interface ProcessInfo {
    id: string,
    name: string,
    running_time_formatted: string,
    memory_in_bytes: number
}

const App: React.FC = () => {
     const [processes, setProcesses] = useState<ProcessInfo[]>([]);
     const [maxMemoryProcess, setMaxMemoryProcess] = useState<ProcessInfo | null>(null);
     const [maxRunTimeProcess, setMaxRunTimeProcess] = useState<ProcessInfo | null>(null);

     useEffect(()=>{
         async function fetchData(){
             const processList = await invoke<ProcessInfo[]>("list_process");
             const maxMemory = await invoke<ProcessInfo>("max_memory");
             const maxRunTime = await invoke<ProcessInfo>("max_time");

             setProcesses(processList);
             console.log(processList);
             setMaxMemoryProcess(maxMemory);
             setMaxRunTimeProcess(maxRunTime);

         }

         fetchData();
         const interval = setInterval(fetchData, 1000);
         return ()=> clearInterval(interval);

     }, []);

     return(
         <main className="container">
            <div className="h-flex">
             {maxMemoryProcess && <ProcessCard title="Max Memory Process" process={maxMemoryProcess}/>}
             {maxRunTimeProcess && <ProcessCard title="Max Running Time Process" process={maxRunTimeProcess}/>}
            </div>

             <div className="process-list">
                 {processes.map((process) => (
                     <div key={process.id} className="process-item">
                         <span>{process.name} (ID: {process.id})</span>
                         <span>Running Time: {process.running_time_formatted}</span>
                         <span>Memory Usage: {process.memory_in_bytes} bytes</span>
                     </div>
                 ))}
             </div>

         </main>
     )
}

export default App