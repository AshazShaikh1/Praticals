import { Link } from "react-router-dom";
import Accordion from "../components/Accordion";

export default function OS(){
  return (
    <div>
      <h2>🖥️ Operating Systems Practicals</h2>
      <p><Link to="/">← Back to Home</Link></p>

      <Accordion title="Practical 7: CPU Scheduling — FCFS / SJF / Priority (Question/Aim)">
        <p><strong>Aim:</strong> Simulate FCFS, SJF and Priority (non-preemptive) CPU scheduling, print CT/TAT/WT and averages, and show Gantt chart.</p>

        <pre><code>{`// C++: FCFS scheduling (example)
// Save as fcfs.cpp and compile with g++
#include <iostream>
#include <algorithm>
using namespace std;

struct Process {
  int pid, at, bt, pr;
  int ct, tat, wt;
};

void display(Process p[], int n) {
  float avgTAT = 0, avgWT = 0;
  cout << "\nPID\tAT\tBT\tPR\tCT\tTAT\tWT\n";
  for (int i = 0; i < n; i++) {
    cout << p[i].pid << "\t" << p[i].at << "\t" << p[i].bt << "\t" << p[i].pr
         << "\t" << p[i].ct << "\t" << p[i].tat << "\t" << p[i].wt << "\n";
    avgTAT += p[i].tat; avgWT += p[i].wt;
  }
  cout << "\nAverage TAT = " << avgTAT / n;
  cout << "\nAverage WT = " << avgWT / n << "\n";
}

void FCFS(Process p[], int n) {
  sort(p, p + n, [](Process a, Process b){ return a.at < b.at; });
  int time = 0;
  for (int i = 0; i < n; i++) {
    time = max(time, p[i].at) + p[i].bt;
    p[i].ct = time;
    p[i].tat = p[i].ct - p[i].at;
    p[i].wt = p[i].tat - p[i].bt;
  }
  cout << "\n--- FCFS Scheduling ---";
  display(p, n);
}

// Example usage omitted for brevity - see main() in PDF transcription.`}</code></pre>
      </Accordion>

      <Accordion title="Practical 8: Round Robin (RR) — Time Quantum">
        <p><strong>Aim:</strong> Implement Round Robin scheduling with configurable time quantum and compute CT/TAT/WT; print Gantt chart and context switches.</p>

        <pre><code>{`// C++: Round Robin scheduling (example)
#include <iostream>
#include <queue>
using namespace std;

struct Process {
  int pid, at, bt, rem, ct, tat, wt, rt;
};

int main() {
  int n, tq;
  cout << "Enter number of processes: "; cin >> n;
  cout << "Enter time quantum: "; cin >> tq;
  vector<Process> p(n);
  for (int i = 0; i < n; i++) {
    p[i].pid = i + 1;
    cout << "AT & BT for P" << i+1 << ": ";
    cin >> p[i].at >> p[i].bt;
    p[i].rem = p[i].bt;
    p[i].rt = -1;
  }
  queue<int> q;
  int time = 0, done = 0;
  bool inQ[100] = {0};
  cout << "\\nGantt Chart: ";
  while (done < n) {
    for (int i = 0; i < n; i++)
      if (p[i].at <= time && p[i].rem > 0 && !inQ[i]) { q.push(i); inQ[i] = true; }
    if (q.empty()) { time++; continue; }
    int i = q.front(); q.pop(); inQ[i] = false;
    cout << time << "|P" << p[i].pid << "|";
    int run = min(tq, p[i].rem);
    if (p[i].rt == -1) p[i].rt = time - p[i].at;
    p[i].rem -= run; time += run;
    for (int j = 0; j < n; j++)
      if (p[j].at <= time && p[j].rem > 0 && !inQ[j]) { q.push(j); inQ[j] = true; }
    if (p[i].rem > 0) { q.push(i); inQ[i] = true; }
    else { p[i].ct = time; done++; }
  }
  cout << time << "\\n";
  // compute and print stats...
  return 0;
}`}</code></pre>
      </Accordion>

      <Accordion title="Practical 9: Memory Management — FIFO & LRU Simulation">
        <p><strong>Aim:</strong> Simulate FIFO and LRU page replacement algorithms and measure hit/miss ratios under patterns (sequential, looping, thrashing).</p>

        <pre><code>{`// C++: FIFO and LRU simulation
#include <iostream>
#include <vector>
#include <queue>
#include <unordered_set>
#include <unordered_map>
#include <list>
#include <iomanip>
using namespace std;

// FIFO & LRU functions as in the notes — see full code in the PDF transcription
`}</code></pre>
      </Accordion>

      <Accordion title="Practical 10: Disk Scheduling & Simple File System">
        <p><strong>Aim:</strong> Simulate disk scheduling (FCFS, SSTF, C-SCAN, C-LOOK) and implement a simple file system with block allocation and directory management.</p>

        <pre><code>{`// C++: Simple File System (conceptual)
#include <iostream>
#include <vector>
#include <string>
#include <cmath>
#include <iomanip>
using namespace std;

struct Block { int id; bool isFree = true; };
struct File { string name; int size; vector<int> blockIndices; };

class FileSystem {
  // constructor, createFile, readFile, deleteFile, listFiles, showBlockMap
  // see OS-Practicals transcription for full implementation
};

int main() {
  const int diskSize = 1024 * 16; // 16 KB disk
  const int blockSize = 1024; // 1 KB block
  FileSystem fs(diskSize, blockSize);
  // simple CLI to create/read/delete/list
}`}</code></pre>
      </Accordion>

      <p style={{marginTop:16}}>— End of OS practicals (extracted). Edit files to add more practicals or tweak the code examples.</p>
    </div>
  );
}
