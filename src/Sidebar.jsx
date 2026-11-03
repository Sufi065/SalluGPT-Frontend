import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

const API_URL = import.meta.env.VITE_API_URL;

function Sidebar() {
    const {
        allThreads,
        setAllThreads,
        currThreadId,
        setNewChat,
        setPrompt,
        setReply,
        setCurrThreadId,
        setPrevChats
    } = useContext(MyContext);

    // Get all threads
    const getAllThreads = async () => {
        try {
            const response = await fetch(`${API_URL}/api/thread`);

            if (!response.ok) {
                throw new Error("Failed to fetch threads");
            }

            const res = await response.json();

            const filteredData = res.map(thread => ({
                threadId: thread.threadId,
                title: thread.title
            }));

            setAllThreads(filteredData);

        } catch (err) {
            console.error("Fetch Threads Error:", err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId]);

    // Create new chat
    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    };

    // Change thread
    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(
                `${API_URL}/api/thread/${newThreadId}`
            );

            if (!response.ok) {
                throw new Error("Failed to load chat");
            }

            const res = await response.json();

            setPrevChats(res);
            setNewChat(false);
            setReply(null);

        } catch (err) {
            console.error("Load Thread Error:", err);
        }
    };

    // Delete thread
    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(
                `${API_URL}/api/thread/${threadId}`,
                { method: "DELETE" }
            );

            if (!response.ok) {
                throw new Error("Failed to delete chat");
            }

            const res = await response.json();
            console.log(res);

            setAllThreads(prev =>
                prev.filter(thread => thread.threadId !== threadId)
            );

            if (threadId === currThreadId) {
                createNewChat();
            }

        } catch (err) {
            console.error("Delete Thread Error:", err);
        }
    };

    return (
        <section className="sidebar">

            <button onClick={createNewChat}>
                <img
                    src="src/assets/chatgpt-logo.jpg"
                    alt="gpt logo"
                    className="logo"
                />

                <span>
                    <i className="fa-solid fa-pen-to-square"></i>
                </span>
            </button>

            <ul className="history">
                {allThreads?.map((thread, idx) => (
                    <li
                        key={thread.threadId || idx}
                        onClick={() => changeThread(thread.threadId)}
                        className={
                            thread.threadId === currThreadId
                                ? "highlighted"
                                : ""
                        }
                    >
                        {thread.title}

                        <i
                            className="fa-solid fa-trash"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteThread(thread.threadId);
                            }}
                        ></i>
                    </li>
                ))}
            </ul>

            <div className="sign">
                <p>𝐵𝑦 𝑆𝑢𝑓𝑖 𝐴𝑘ℎ𝑡𝑒𝑟&hearts;</p>
            </div>

        </section>
    );
}

export default Sidebar;