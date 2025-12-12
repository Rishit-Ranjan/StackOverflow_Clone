import QuestionDetail from "@/components/QuestionDetail";
import Mainlayout from "@/layout/Mainlayout";
import { useParams } from "react-router-dom";
import React from "react";

const index = () => {
  const { id } = useParams();
  return (
    <Mainlayout>
      <div>
        <QuestionDetail questionId={id || ""} />
      </div>
    </Mainlayout>
  );
};

export default index;
