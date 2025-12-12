import Mainlayout from "@/layout/Mainlayout";

export default function Tags() {
    const tags = [
        { name: "javascript", count: 2500000 },
        { name: "python", count: 2100000 },
        { name: "java", count: 1900000 },
        { name: "c#", count: 1600000 },
        { name: "php", count: 1400000 },
        { name: "android", count: 1300000 },
        { name: "html", count: 1200000 },
        { name: "jquery", count: 1000000 },
        { name: "c++", count: 800000 },
        { name: "css", count: 850000 },
        { name: "ios", count: 700000 },
        { name: "mysql", count: 680000 },
        { name: "sql", count: 650000 },
        { name: "node.js", count: 550000 },
        { name: "react", count: 500000 },
    ];

    return (
        <Mainlayout>
            <main className="min-w-0 p-4 lg:p-6">
                <h1 className="text-xl lg:text-2xl font-semibold mb-6">Tags</h1>
                <p className="text-gray-600 mb-6">
                    A tag is a keyword or label that categorizes your question with other, similar questions.
                    Using the right tags makes it easier for others to find and answer your question.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {tags.map((tag) => (
                        <div
                            key={tag.name}
                            className="border border-gray-200 rounded p-4 hover:border-gray-300 transition-colors"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                                    {tag.name}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600">
                                {tag.count.toLocaleString()} questions
                            </p>
                        </div>
                    ))}
                </div>
            </main>
        </Mainlayout>
    );
}
