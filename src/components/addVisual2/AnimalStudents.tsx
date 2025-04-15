import React from "react";

const AnimalStudents: React.FC = () => {
  const students = [
    { color: "#FFC3A0", type: "rabbit", position: "bottom-2 left-4" },
    { color: "#A0DDFF", type: "cat", position: "bottom-4 right-6" },
    { color: "#C2E7B0", type: "dog", position: "bottom-1 left-1/4" },
    { color: "#FFD8CC", type: "squirrel", position: "bottom-3 right-1/4" },
  ];

  return (
    <div className="relative w-full h-24">
      {students.map((student, index) => (
        <div
          key={index}
          className={`absolute ${student.position} animate-bounce-in`}
          style={{ animationDelay: `${index * 0.2}s` }}
        >
          <AnimalHead color={student.color} type={student.type} />
        </div>
      ))}
    </div>
  );
};

interface AnimalHeadProps {
  color: string;
  type: string;
}

const AnimalHead: React.FC<AnimalHeadProps> = ({ color, type }) => {
  // Different animal head renderings based on type
  switch (type) {
    case "rabbit":
      return (
        <div className="relative">
          <div
            style={{ backgroundColor: color }}
            className="w-20 h-20 rounded-full flex justify-center items-center"
          >
            <img src="/bunny (1).png" alt="rabbit" />
          </div>
        </div>
      );

    case "cat":
      return (
        <div className="relative">
          <div
            style={{ backgroundColor: color }}
            className="w-20 h-20 rounded-full flex justify-center items-center"
          >
            <img src="/cat.png" alt="cat" />
          </div>
        </div>
      );

    case "dog":
      return (
        <div className="relative">
          <div
            style={{ backgroundColor: color }}
            className="w-20 h-20 rounded-full flex justify-center items-center"
          >
            <img src="/dog.png" alt="dog" />
          </div>
        </div>
      );

    case "squirrel":
      return (
        <div className="relative">
          <div
            style={{ backgroundColor: color }}
            className="w-20 h-20 rounded-full flex justify-center items-center"
          >
            <img src="/squirrel.png" alt="squirrel" />
          </div>
        </div>
      );

    default:
      return (
        <div
          style={{ backgroundColor: color }}
          className="w-16 h-16 rounded-full"
        ></div>
      );
  }
};

export default AnimalStudents;
