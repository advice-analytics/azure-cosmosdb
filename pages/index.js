import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  VStack,
  Input,
  Button,
  IconButton,
  useToast,
  Spacer,
  HStack,
} from "@chakra-ui/react";
import { DeleteIcon, CheckIcon } from "@chakra-ui/icons";

const fetchPlans = async () => {
  const res = await fetch("/api/plandata/list");
  return await res.json();
};

const createPlan = async (title, file) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("file", file);

  const res = await fetch("/api/plandata/create", {
    method: "POST",
    body: formData,
  });
  return await res.json();
};

const updatePlan = async (id, updatedPlan) => {
  await fetch(`/api/plandata/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedPlan),
  });
};

const deletePlan = async (id) => {
  await fetch(`/api/plandata/${id}`, { method: "DELETE" });
};

export default function Home() {
  const [plans, setPlans] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchPlansData = async () => {
      const plansData = await fetchPlans();
      setPlans(plansData);
    };
    fetchPlansData();
  }, []);

  const handleCreate = async () => {
    if (inputValue.trim() && selectedFile) {
      const newPlan = await createPlan(inputValue, selectedFile);
      setPlans([...plans, newPlan]);
      setInputValue("");
      setSelectedFile(null);
      toast({
        title: "Plan created.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Please provide a title and select a file.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdate = async (id, completed) => {
    const updatedPlan = plans.find((plan) => plan.id === id);
    updatedPlan.completed = completed;
    await updatePlan(id, updatedPlan);
    setPlans([...plans]); // Update plans state to trigger re-render
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleDelete = async (id) => {
    await deletePlan(id);
    setPlans(plans.filter((plan) => plan.id !== id));
  };

  return (
    <Box>
      <Heading mt={8} textAlign="center">
        Financial Plans Management
      </Heading>
      <VStack mt={4} spacing={4} mx="auto" maxW="md">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new plan"
        />
        <Input
          type="file"
          onChange={handleFileChange}
        />
        <Button onClick={handleCreate} colorScheme="blue">
          Add Plan
        </Button>
        {plans.length > 0 ? (
          plans.map((plan) => (
            <HStack key={plan.id} w="100%">
              <IconButton
                aria-label="Delete plan"
                icon={<DeleteIcon />}
                onClick={() => handleDelete(plan.id)}
                colorScheme="red"
              />
              <Spacer />
              <Box>{plan.title}</Box>
              <CheckIcon color="green.500" />
            </HStack>
          ))
        ) : (
          <Box>No plans found.</Box>
        )}
      </VStack>
    </Box>
  );
}
