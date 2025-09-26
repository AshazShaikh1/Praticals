import { Link } from "react-router-dom";
import Accordion from "../components/Accordion";

export default function OS(){
  return (
    <div>
      <h2>🖥️ Operating Systems Practicals</h2>
      <p><Link to="/">← Back to Home</Link></p>

      <Accordion title="Practical 1: Process Communication using Shared Memory">
        <p>1 Understand shared memory concepts in inter-process communication.</p>
        <pre><code>{`
#include <iostream>
#include <sys/mman.h>
#include <fcntl.h>
#include <unistd.h>
#include <cstring>
#include <sys/wait.h>

int main() {
    const char* name = "/my_shared_mem";
    const int SIZE = 4096;

    // Create shared memory object
    int shm_fd = shm_open(name, O_CREAT | O_RDWR, 0666);
    ftruncate(shm_fd, SIZE);

    // Map shared memory
    void* ptr = mmap(0, SIZE, PROT_READ | PROT_WRITE, MAP_SHARED, shm_fd, 0);

    int* data = static_cast<int*>(ptr);
    
    // Initialize data
    data[0] = 1;
    data[1] = 2;
    data[2] = 3;

    pid_t pid = fork();

    if (pid == 0) {
        // Child process
        std::cout << "Child sees: " << data[0] << ", " << data[1] << ", " << data[2] << std::endl;
        data[0] = 100;
        data[1] = 200;
        std::cout << "Child modified values.\n";
        munmap(ptr, SIZE);
    } else {
        // Parent process
        wait(NULL); // Wait for child to finish
        std::cout << "Parent sees: " << data[0] << ", " << data[1] << ", " << data[2] << std::endl;

        // Cleanup
        munmap(ptr, SIZE);
        close(shm_fd);
        shm_unlink(name);
    }

    return 0;
}

        `}</code></pre>

        <p>2 Implement producer-consumer synchronization using shared memory and semaphores.</p>
        <pre><code>{`
#include <iostream>
#include <fcntl.h>       // For O_* constants
#include <sys/mman.h>    // For shm_open, mmap
#include <semaphore.h>   // For sem_open, sem_wait, sem_post
#include <unistd.h>      // For ftruncate, fork, sleep
#include <cstring>       // For memset
#include <sys/wait.h>    // For wait

const char* SHM_NAME = "/prod_cons_shm";
const char* SEM_EMPTY = "/sem_empty";
const char* SEM_FULL = "/sem_full";
const char* SEM_MUTEX = "/sem_mutex";

const int BUFFER_SIZE = 5;

struct SharedMemory {
    int buffer[BUFFER_SIZE];
    int in = 0;
    int out = 0;
};

void producer(SharedMemory* shm) {
    sem_t* empty = sem_open(SEM_EMPTY, 0);
    sem_t* full  = sem_open(SEM_FULL, 0);
    sem_t* mutex = sem_open(SEM_MUTEX, 0);

    for (int i = 1; i <= 10; ++i) {
        sem_wait(empty);
        sem_wait(mutex);

        shm->buffer[shm->in] = i;
        std::cout << "Produced: " << i << std::endl;
        shm->in = (shm->in + 1) % BUFFER_SIZE;

        sem_post(mutex);
        sem_post(full);
        sleep(1);  // Simulate delay
    }
}

void consumer(SharedMemory* shm) {
    sem_t* empty = sem_open(SEM_EMPTY, 0);
    sem_t* full  = sem_open(SEM_FULL, 0);
    sem_t* mutex = sem_open(SEM_MUTEX, 0);

    for (int i = 1; i <= 10; ++i) {
        sem_wait(full);
        sem_wait(mutex);

        int item = shm->buffer[shm->out];
        std::cout << "Consumed: " << item << std::endl;
        shm->out = (shm->out + 1) % BUFFER_SIZE;

        sem_post(mutex);
        sem_post(empty);
        sleep(2);  // Simulate delay
    }
}

int main() {
    // Create shared memory
    int shm_fd = shm_open(SHM_NAME, O_CREAT | O_RDWR, 0666);
    ftruncate(shm_fd, sizeof(SharedMemory));
    void* ptr = mmap(0, sizeof(SharedMemory), PROT_READ | PROT_WRITE, MAP_SHARED, shm_fd, 0);
    SharedMemory* shm = static_cast<SharedMemory*>(ptr);
    memset(shm, 0, sizeof(SharedMemory));

    // Create semaphores
    sem_t* empty = sem_open(SEM_EMPTY, O_CREAT, 0666, BUFFER_SIZE);
    sem_t* full  = sem_open(SEM_FULL, O_CREAT, 0666, 0);
    sem_t* mutex = sem_open(SEM_MUTEX, O_CREAT, 0666, 1);

    // Fork processes
    pid_t pid = fork();
    if (pid == 0) {
        consumer(shm);
    } else {
        producer(shm);
        wait(NULL);  // Wait for consumer
        // Cleanup
        munmap(shm, sizeof(SharedMemory));
        close(shm_fd);
        shm_unlink(SHM_NAME);

        sem_unlink(SEM_EMPTY);
        sem_unlink(SEM_FULL);
        sem_unlink(SEM_MUTEX);
    }

    return 0;
}

        `}</code></pre>

        <p>3 Explore issues of race conditions and how to avoid them.</p>
        <pre><code>{`
          #include <iostream>
#include <thread>

int counter = 0;

void increment() {
    for (int i = 0; i < 100000; ++i)
        counter++;
}

int main() {
    std::thread t1(increment);
    std::thread t2(increment);

    t1.join();
    t2.join();

    std::cout << "Final counter: " << counter << std::endl;
    return 0;
}

        `}</code></pre>
      </Accordion>

      <Accordion title="Practical 2: Process Communication using Message Passing">
        <p>1 Use message queues/pipes to solve the producer-consumer problem.</p>
        <pre><code>{`
          #include <iostream.h>
#include <unistd.h>
#include <string.h>
#include <sys/wait.h>

int main() {
    int fd[2];
    pipe(fd); // fd[0]: read, fd[1]: write

    pid_t pid = fork();

    if (pid == 0) {
        // Child - Consumer
        close(fd[1]);  // Close unused write end
        char buffer[100];
        read(fd[0], buffer, sizeof(buffer));
        std::cout << "Consumed: " << buffer << std::endl;
        close(fd[0]);
    } else {
        // Parent - Producer
        close(fd[0]);  // Close unused read end
        const char* msg = "Item 1";
        write(fd[1], msg, strlen(msg) + 1);
        std::cout << "Produced: " << msg << std::endl;
        close(fd[1]);
        wait(NULL); // Wait for child to finish
    }
    return 0;
}

        `}</code></pre>
      </Accordion>

      <Accordion title="Practical 3: Threading and Single Thread Control Flow">
        <p>1 Practice thread creation and basic thread lifecycle using standard
libraries (e.g., pthreads or Java threads).</p>
        <pre><code>{`
#include <iostream>
#include <pthread.h>
#include <unistd.h>
void* func(void* arg) {
std::cout << "Thread started\n";
slep(1);
std::cout << "Thread finished\n";
return nullptr;
}
int main() {
pthread_t t;
pthread_create(&t, nullptr, func, nullptr);
pthread_join(t, nullptr);
std::cout << "Main exiting\n";
}
        `}</code></pre>

        <p>2 Observe execution order, thread joining, and delays.</p>
        <pre><code>{`
#include <iostream>
#include <pthread.h>
#include <unistd.h>
void* func(void* arg) {
std::cout << "Thread started\n";
slep(1);
std::cout << "Thread finished\n";
return nullptr;
}
int main() {
pthread_t t;
pthread_create(&t, nullptr, func, nullptr);
pthread_join(t, nullptr);
std::cout << "Main exiting\n";
}
        `}</code></pre>

        <p>3 Measure execution time for sequential vs threaded execution.</p>
        <pre><code>{`
#include <iostream>
#include <thread>
#include <chrono>
void work() { std::this_thread::sleep_for(std::chrono::seconds(2)); }
int main() {
auto start = std::chrono::steady_clock::now();
work(); work();
auto mid = std::chrono::steady_clock::now();
std::thread t1(work), t2(work);
t1.join(); t2.join();
auto end = std::chrono::steady_clock::now();
std::cout << "Sequential: " << (mid - start).count() << ", Threaded: " << (end -
mid).count() << "\n";
}
        `}</code></pre>
      </Accordion>

      <Accordion title="Practical 4: Multi-threading and Fibonacci Generation">
        <p>1 Implement multi-threading to generate and print Fibonacci
sequences.</p>
        <pre><code>{`
#include <iostream>
#include <thread>
void fib(int n) { int a=0, b=1; for(int i=0;i<n;++i){std::cout<<a<<" "; int
c=a+b; a=b; b=c;} std::cout<<"\n"; }
int main() {
std::thread t1(fib, 5);
std::thread t2(fib, 7);
t1.join();
t2.join();
return 0;
}
        `}</code></pre>

        <p>2 Explore thread safety, synchronization when accessing shared
variables.</p>
<pre><code>{`
  #include <iostream>
#include <thread>
#include <mutex>
int counter = 0;
std::mutex mtx;
void safe_increment() {
for (int i = 0; i < 100000; ++i) {
std::lock_guard<std::mutex> lock(mtx); // synchronized access
++counter;
}
}
int main() {
std::thread t1(safe_increment);
std::thread t2(safe_increment);
t1.join(); t2.join();
std::cout << "Final counter: " << counter << std::endl;
}
`}</code></pre>

<p>3 Introduce concepts of thread pooling and task delegation.</p>
<pre><code>{`
  #include <iostream>
#include <future>
int task(int id) { std::cout << "Task " << id << " done\n"; return id; }
int main() {
auto f1 = std::async(std::launch::async, task, 1);
auto f2 = std::async(std::launch::async, task, 2);
auto f3 = std::async(std::launch::async, task, 3);
f1.get(); f2.get(); f3.get();
return 0;
}
`}</code></pre>
      </Accordion>

      <Accordion title="Practical 5: Process Synchronization and Bounded Buffer">
        <p>1 Simulate producer-consumer bounded buffer using mutex and semaphores.</p>
        <pre><code>{`
#include<bits/stdc++.h>
#include<pthread.h>
#include<semaphore.h>
#include <unistd.h> 
using namespace std;

// Declaration
int r1,total_produced=0,total_consume=0;

// Semaphore declaration
sem_t notEmpty;

// Producer Section
void* produce(void *arg){
    while(1){
      cout<<"Producer produces item."<<endl;
      cout<<"Total produced = "<<++total_produced<<
        " Total consume = "<<total_consume*-1<<endl;
      sem_post(&notEmpty);    
      sleep(rand()%100*0.01);
    }
}

// Consumer Section
void* consume(void *arg){
    while(1){
      sem_wait(&notEmpty);
      cout<<"Consumer consumes item."<<endl;    
      cout<<"Total produced = "<<total_produced<<
        " Total consume = "<<(--total_consume)*-1<<endl;
      sleep(rand()%100*0.01);
    }    
}

int main(int argv,char *argc[]){

    // thread declaration
    pthread_t producer,consumer;

    // Declaration of attribute......
    pthread_attr_t attr;

    // semaphore initialization
    sem_init(&notEmpty,0,0);

    // pthread_attr_t initialization
    pthread_attr_init(&attr);
    pthread_attr_setdetachstate(&attr,PTHREAD_CREATE_JOINABLE);

    // Creation of process
    r1=pthread_create(&producer,&attr,produce,NULL);
    if(r1){
      cout<<"Error in creating thread"<<endl;
      exit(-1);
    }

    r1=pthread_create(&consumer,&attr,consume,NULL);
    if(r1){
      cout<<"Error in creating thread"<<endl;
      exit(-1);
    }

    // destroying the pthread_attr
    pthread_attr_destroy(&attr);

    // Joining the thread
    r1=pthread_join(producer,NULL);
    if(r1){
      cout<<"Error in joining thread"<<endl;
      exit(-1);
    }

    r1=pthread_join(consumer,NULL);
    if(r1){
      cout<<"Error in joining thread"<<endl;
      exit(-1);
    }

    // Exiting thread
    pthread_exit(NULL);

    return 0;
}
        `}</code></pre>

        <p>2 Implement buffer control with synchronized access.</p>
        <pre><code>{`
#include <iostream>
#include <queue>
#include <thread>
#include <mutex>
#include <condition_variable>
using namespace std;

queue<int> buffer; const int SIZE = 5;
mutex mtx; condition_variable cv;

void producer() {
    while (true) {
        unique_lock<mutex> lock(mtx);
        cv.wait(lock, [] { return buffer.size() < SIZE; });
        buffer.push(rand() % 100); cout << "Produced\n";
        cv.notify_all();
    }
}

void consumer() {
    while (true) {
        unique_lock<mutex> lock(mtx);
        cv.wait(lock, [] { return !buffer.empty(); });
        cout << "Consumed " << buffer.front() << endl; buffer.pop();
        cv.notify_all();
    }
}

int main() {
    thread p1(producer), c1(consumer);
    p1.join(); c1.join();
}
        `}</code></pre>

        <p>3 Introduce circular queue techniques for managing shared buffers. </p>
        <per><code>{`
#include <iostream>
#include <thread>
#include <mutex>
#include <condition_variable>
using namespace std;

const int SIZE = 5;
int buffer[SIZE];
int front = 0, rear = 0, count = 0;
mutex mtx; condition_variable cv;

void producer() {
    while (true) {
        unique_lock<mutex> lock(mtx);
        cv.wait(lock, [] { return count < SIZE; });
        buffer[rear] = rand() % 100;
        rear = (rear + 1) % SIZE;
        count++;
        cout << "Produced: " << buffer[(rear - 1 + SIZE) % SIZE] << endl;
        cv.notify_all();
    }
}

void consumer() {
    while (true) {
        unique_lock<mutex> lock(mtx);
        cv.wait(lock, [] { return count > 0; });
        int item = buffer[front];
        front = (front + 1) % SIZE;
        count--;
        cout << "Consumed: " << item << endl;
        cv.notify_all();
    }
}

int main() {
    thread p(producer), c(consumer);
    p.join(); c.join();
}
        `}</code></per>
      </Accordion>

      <Accordion title="Practicle 6:Readers-Writers Problem – Synchronization in Shared Access">
        <p>1 1.	Implement reader and writer prioritization.</p>
        <pre><code>{`
#include <iostream>
#include <thread>
#include <mutex>
#include <condition_variable>

std::mutex mtx;
std::condition_variable cv;
int readers = 0;
int writers_waiting = 0;
bool writer_active = false;
int shared_data = 0;

void reader(int id) {
    std::unique_lock<std::mutex> lock(mtx);
    cv.wait(lock, [](){ return !writer_active && writers_waiting == 0; });
    readers++;
    lock.unlock();

    // Reading section
    std::cout << "Reader " << id << " reads: " << shared_data << "\n";

    lock.lock();
    readers--;
    if (readers == 0) cv.notify_all();
}

void writer(int id) {
    std::unique_lock<std::mutex> lock(mtx);
    writers_waiting++;
    cv.wait(lock, [](){ return !writer_active && readers == 0; });
    writers_waiting--;
    writer_active = true;
    lock.unlock();

    // Writing section
    ++shared_data;
    std::cout << "Writer " << id << " writes: " << shared_data << "\n";

    lock.lock();
    writer_active = false;
    cv.notify_all();
}

int main() {
    std::thread r1(reader, 1);
    std::thread w1(writer, 1);
    std::thread r2(reader, 2);

    r1.join();
    w1.join();
    r2.join();
    return 0;
}

        `}</code></pre>

        <p>2 2.	Use semaphores to allow multiple readers or exclusive writer access.</p>
        <pre><code>{`
#include <iostream>
#include <thread>
#include <mutex>
#include <condition_variable>
using namespace std;

mutex rw_mutex, mtx;
int read_count = 0;

void reader() {
    while (true) {
        unique_lock<mutex> lock(mtx);
        read_count++;
        if (read_count == 1) rw_mutex.lock();  // First reader locks writer
        lock.unlock();

        cout << "Reading\n";
        this_thread::sleep_for(chrono::milliseconds(500));

        lock.lock();
        read_count--;
        if (read_count == 0) rw_mutex.unlock();  // Last reader releases writer
        lock.unlock();
    }
}

void writer() {
    while (true) {
        rw_mutex.lock();  // Writer gets exclusive access
        cout << "Writing\n";
        this_thread::sleep_for(chrono::milliseconds(1000));
        rw_mutex.unlock();
    }
}

int main() {
    thread r1(reader), r2(reader), r3(reader), w(writer);
    r1.join(); r2.join(); r3.join(); w.join();
}

        `}</code></pre>

        <p>3 Extend to fairness in access and deadlock prevention.</p>
        <per><code>{`
#include <iostream>
#include <thread>
#include <mutex>
#include <condition_variable>
using namespace std;

mutex rw_mutex, mtx;
int read_count = 0; bool writer_waiting = false;
condition_variable cv;

void reader() {
    while (true) {
        unique_lock<mutex> lock(mtx);
        cv.wait(lock, [] { return !writer_waiting; });
        read_count++; if (read_count == 1) rw_mutex.lock();
        lock.unlock();
        cout << "Reading\n"; this_thread::sleep_for(chrono::milliseconds(500));
        lock.lock(); read_count--; if (read_count == 0) rw_mutex.unlock();
        lock.unlock(); cv.notify_all();
    }
}

void writer() {
    while (true) {
        { lock_guard<mutex> lock(mtx); writer_waiting = true; }
        rw_mutex.lock(); cout << "Writing\n"; this_thread::sleep_for(chrono::milliseconds(1000));
        rw_mutex.unlock(); { lock_guard<mutex> lock(mtx); writer_waiting = false; }
        cv.notify_all();
    }
}

int main() { thread r1(reader), r2(reader), w(writer); r1.join(); r2.join(); w.join(); }
        `}</code></per>
      </Accordion>

      <Accordion title="Practicle 7: CPU Scheduling Algorithms (Part 1) – FCFS and Non-preemptive Scheduling.">
        <p>1 1.	Simulate First-Come First-Serve scheduling.</p>
        <pre><code>{`
#include<iostream>
using namespace std;

// Function to find the waiting time for all 
// processes
void findWaitingTime(int processes[], int n, 
                          int bt[], int wt[])
{
    // waiting time for first process is 0
    wt[0] = 0;

    // calculating waiting time
    for (int  i = 1; i < n ; i++ )
        wt[i] =  bt[i-1] + wt[i-1] ;
}

// Function to calculate turn around time
void findTurnAroundTime( int processes[], int n, 
                  int bt[], int wt[], int tat[])
{
    // calculating turnaround time by adding
    // bt[i] + wt[i]
    for (int  i = 0; i < n ; i++)
        tat[i] = bt[i] + wt[i];
}

//Function to calculate average time
void findavgTime( int processes[], int n, int bt[])
{
    int wt[n], tat[n], total_wt = 0, total_tat = 0;

    //Function to find waiting time of all processes
    findWaitingTime(processes, n, bt, wt);

    //Function to find turn around time for all processes
    findTurnAroundTime(processes, n, bt, wt, tat);

    //Display processes along with all details
    cout << "Processes  "<< " Burst time  "
         << " Waiting time  " << " Turn around time\n";

    // Calculate total waiting time and total turn 
    // around time
    for (int  i=0; i<n; i++)
    {
        total_wt = total_wt + wt[i];
        total_tat = total_tat + tat[i];
        cout << "   " << i+1 << "\t\t" << bt[i] <<"\t    "
            << wt[i] <<"\t\t  " << tat[i] <<endl;
    }

    cout << "Average waiting time = " 
         << (float)total_wt / (float)n;
    cout << "\nAverage turn around time = " 
         << (float)total_tat / (float)n;
}

// Driver code
int main()
{
    //process id's
    int processes[] = { 1, 2, 3};
    int n = sizeof processes / sizeof processes[0];

    //Burst time of all processes
    int  burst_time[] = {10, 5, 8};

    findavgTime(processes, n,  burst_time);
    return 0;
}
        `}</code></pre>

        <p>2 Extend implementation to general non-preemptive scheduling.</p>
        <pre><code>{`
#include <iostream>
#include <algorithm>
using namespace std;

struct Process {
    int pid, at, bt, pr; // process id, arrival time, burst time, priority
    int ct, tat, wt;
};

// Function to display result
void display(Process p[], int n) {
    float avgTAT = 0, avgWT = 0;
    cout << "\nPID\tAT\tBT\tPR\tCT\tTAT\tWT\n";
    for (int i = 0; i < n; i++) {
        cout << p[i].pid << "\t" << p[i].at << "\t" << p[i].bt << "\t" << p[i].pr
             << "\t" << p[i].ct << "\t" << p[i].tat << "\t" << p[i].wt << "\n";
        avgTAT += p[i].tat;
        avgWT += p[i].wt;
    }
    cout << "\nAverage TAT = " << avgTAT / n;
    cout << "\nAverage WT = " << avgWT / n << "\n";
}

// FCFS Scheduling
void FCFS(Process p[], int n) {
    sort(p, p + n, [](Process a, Process b){ return a.at < b.at; });
    int time = 0;
    for (int i = 0; i < n; i++) {
        time = max(time, p[i].at) + p[i].bt;
        p[i].ct = time;
        p[i].tat = p[i].ct - p[i].at;
        p[i].wt  = p[i].tat - p[i].bt;
    }
    cout << "\n--- FCFS Scheduling ---";
    display(p, n);
}

// SJF Scheduling
void SJF(Process p[], int n) {
    bool done[100] = {0};
    int time = 0, completed = 0;
    while (completed < n) {
        int idx = -1, mn = 1e9;
        for (int i = 0; i < n; i++) {
            if (!done[i] && p[i].at <= time && p[i].bt < mn) {
                mn = p[i].bt; idx = i;
            }
        }
        if (idx == -1) { time++; continue; }
        time += p[idx].bt;
        p[idx].ct = time;
        p[idx].tat = p[idx].ct - p[idx].at;
        p[idx].wt = p[idx].tat - p[idx].bt;
        done[idx] = true;
        completed++;
    }
    cout << "\n--- SJF Scheduling ---";
    display(p, n);
}

// Priority Scheduling
void Priority(Process p[], int n) {
    bool done[100] = {0};
    int time = 0, completed = 0;
    while (completed < n) {
        int idx = -1, pr = 1e9;
        for (int i = 0; i < n; i++) {
            if (!done[i] && p[i].at <= time && p[i].pr < pr) {
                pr = p[i].pr; idx = i;
            }
        }
        if (idx == -1) { time++; continue; }
        time += p[idx].bt;
        p[idx].ct = time;
        p[idx].tat = p[idx].ct - p[idx].at;
        p[idx].wt = p[idx].tat - p[idx].bt;
        done[idx] = true;
        completed++;
    }
    cout << "\n--- Priority Scheduling ---";
    display(p, n);
}

int main() {
    int n, choice;
    cout << "Enter number of processes: ";
    cin >> n;
    Process p[100];
    for (int i = 0; i < n; i++) {
        p[i].pid = i + 1;
        cout << "\nProcess " << i + 1 << ":\n";
        cout << "Arrival Time: "; cin >> p[i].at;
        cout << "Burst Time: "; cin >> p[i].bt;
        cout << "Priority: "; cin >> p[i].pr;
    }

    cout << "\nChoose Scheduling Algorithm:\n1. FCFS\n2. SJF\n3. Priority\nChoice: ";
    cin >> choice;

    if (choice == 1) FCFS(p, n);
    else if (choice == 2) SJF(p, n);
    else if (choice == 3) Priority(p, n);
    else cout << "Invalid Choice!";
    
    return 0;
}

        `}</code></pre>

        <p>3 Analyze waiting time, turnaround time, and Gantt chart generation.</p>
        <per><code>{`
#include <iostream>
using namespace std;
int main() {
    int n; cout << "No. of processes: "; cin >> n;
    int at[20], bt[20], ct[20], tat[20], wt[20];
    cout << "Enter AT & BT:\n";
    for(int i=0;i<n;i++) cin>>at[i]>>bt[i];
    int time=0;
    cout << "\nGantt Chart:\n";
    for(int i=0;i<n;i++){
        time = max(time,at[i])+bt[i];
        ct[i]=time; tat[i]=ct[i]-at[i]; wt[i]=tat[i]-bt[i];
        cout << "| P"<<i+1<<" ";
    }
    cout << "|\n0 ";
    for(int i=0;i<n;i++) cout<<ct[i]<<" ";
    cout << "\n\nPID\tAT\tBT\tCT\tTAT\tWT\n";
    float avgT=0,avgW=0;
    for(int i=0;i<n;i++){
        cout<<i+1<<"\t"<<at[i]<<"\t"<<bt[i]<<"\t"<<ct[i]<<"\t"<<tat[i]<<"\t"<<wt[i]<<"\n";
        avgT+=tat[i]; avgW+=wt[i];
    }
    cout<<"Avg TAT="<<avgT/n<<"  Avg WT="<<avgW/n;
}

        `}</code></per>
      </Accordion>

      <p style={{marginTop:16}}>— End of OS practicals (extracted). Edit files to add more practicals or tweak the code examples.</p>
    </div>
  );
}
