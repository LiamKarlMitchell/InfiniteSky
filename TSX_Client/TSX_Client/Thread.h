// Thread.h
#ifndef __THREAD_H__
#define __THREAD_H__
// #############################################################################
#define WIN32_LEAN_AND_MEAN
#include <Windows.h>
// =============================================================================
template<class T>
class Thread
{
    // new type Method: pointer to a object's method (this call)
    typedef DWORD (T::* Method)(void);
// -----------------------------------------------------------------------------
protected:
    HANDLE  hThread;      // unique handle to the thread
private:
    DWORD   threadID;     // thread id - 0 until started
    T*      object;       // the object which owns the method
    Method  method;       // the method of the object
    HANDLE  hInterrupt;   // mutex to signal an interrupt via ReleaseSemaphore()
    HANDLE  hSingleStart; // only one thread allowed to call start() mutex
// -----------------------------------------------------------------------------
private:
    // This function gets executed by a concurrent thread.
    static DWORD run(LPVOID thread_obj)
    {
        Thread<T>* thread = (Thread<T>*)thread_obj;
        return (thread->object->*thread->method) ();
    }
    // Prevent copying of threads: No sensible implementation!
    Thread(const Thread<T>& other) {}
    // Prevent assignment of threads: No sensible implementation!
    Thread<T>& operator =(const Thread<T>& other) {}
// -----------------------------------------------------------------------------
public:
    /* Creates a new Thread object. object: the one which method should be
    executed. method: pointer to the object's method. */
    explicit Thread(T* object, DWORD ( T::* method)(void))
    {
        this->hThread       = NULL;
        this->object        = object;
        this->method        = method;
        this->threadID      = 0;
        this->hInterrupt    = CreateSemaphore(NULL, 1, 1, NULL);
        this->hSingleStart  = CreateMutex(NULL, FALSE, NULL);
        // this->hInterrupt = CreateMutex(NULL, FALSE, NULL);
    }

	Thread()
	{
		this->hThread       = NULL;
        //this->object        = object;
        //this->method        = method;
        this->threadID      = 0;
        this->hInterrupt    = CreateSemaphore(NULL, 1, 1, NULL);
        this->hSingleStart  = CreateMutex(NULL, FALSE, NULL);
        // this->hInterrupt = CreateMutex(NULL, FALSE, NULL);
	}
// -----------------------------------------------------------------------------
    ~Thread(void)
    {
        if (hInterrupt)
            CloseHandle(hInterrupt);
        if (hThread)
            CloseHandle(hThread);
    }
// -----------------------------------------------------------------------------

	void set(T* object, DWORD ( T::* method)(void))
	{
		if (this->hThread==NULL)
		{
			this->object        = object;
			this->method        = method;
        //this->threadID      = 0;
        //this->hInterrupt    = CreateSemaphore(NULL, 1, 1, NULL);
        //this->hSingleStart  = CreateMutex(NULL, FALSE, NULL);
        // this->hInterrupt = CreateMutex(NULL, FALSE, NULL);
		}
	}
    /* Starts executing the objects method in a concurrent thread. True if the
    thread was started successfully; otherwise false. */
    bool start()
    {
        __try {
            if (WaitForSingleObject(hSingleStart, 0) != WAIT_OBJECT_0)
                return false;
            if (hThread)    // Thread had been started sometime in the past
            {
                if (WaitForSingleObject(hThread, 0) == WAIT_TIMEOUT)
                {   // if thread's still running deny new start
                    return false;
                }
                CloseHandle(hThread);
            }
            // (Re-)Set not interrupted semaphore state
            WaitForSingleObject(hInterrupt, 0);

            hThread = CreateThread(
                NULL,
                0,
                (LPTHREAD_START_ROUTINE) Thread<T>::run,
                this,
                0,
                &this->threadID
            );
            if (hThread)
                return true;
            return false;
        }
        __finally
        {
            ReleaseMutex(hSingleStart);
        }
    }
// -----------------------------------------------------------------------------
    // Blocks the calling thread until this thread has stopped.
    inline void join()
    {
        WaitForSingleObject(hThread, INFINITE);
    }
// -----------------------------------------------------------------------------
    /* Asks the thread to exit nicely. Thread function must implement checks.
    return value indicates if the interrupt could be placed not if the thread
    reacts on the interrupt. true indicates success, false an error. */
    inline bool interrupt()
    {
        if (hInterrupt)
        {
            return ((ReleaseSemaphore(hInterrupt, 1, NULL) == FALSE) ?
                false : true);
        }
        return false;
    }
// -----------------------------------------------------------------------------
    /* True if an interrupt request was set, otherwise false. */
    inline bool isInterrupted()
    {
        return this->isInterrupted(0);
    }
// -----------------------------------------------------------------------------
    /* True if an interrupt request was set, otherwise false. Waits for millisec
    milliseconds for the interrupt to take place. */
    inline bool isInterrupted(DWORD millisec)
    {
        if (WaitForSingleObject(hInterrupt, millisec) == WAIT_TIMEOUT)
        {
            return false;
        }
        ReleaseSemaphore(hInterrupt, 1, NULL);  // keep interrupted state
        return true;
    }
// -----------------------------------------------------------------------------
    inline bool isRunning()
    {
        DWORD exitCode = 0;
        if (hThread)
            GetExitCodeThread(hThread, &exitCode);
        if (exitCode == STILL_ACTIVE)
            return true;
        return false;
    }
// -----------------------------------------------------------------------------
    // Getter & Setter
// -----------------------------------------------------------------------------
    __declspec(property(get = getThreadHandle)) HANDLE ThreadHandle;
    inline HANDLE getThreadHandle()
    {
        return hThread;
    }
// -----------------------------------------------------------------------------
    __declspec(property(get = getThreadID)) DWORD ThreadID;
    inline DWORD getThreadID()
    {
        return threadID;
    }
// -----------------------------------------------------------------------------
};
// #############################################################################
#endif // __THREAD_H__