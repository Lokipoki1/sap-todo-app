import { Box, Button, Container, FormControl, Heading, Input, Textarea, useColorModeValue, useDisclosure, useToast, VStack} from "@chakra-ui/react";
import React, { useState } from "react";

const InputTodo = () => {

    const [newTodo, setNewTodo] = useState({
        title: "",
        description: ""
    });

    const { onClose } = useDisclosure();

    const toast =  useToast();

    const handleAddTask = async (e) => {
        e.preventDefault();
        if(!newTodo.title.trim()){
            toast({
                title: "Error",
                description: "Please give a title for the task",
                status: "error",
                isClosable: true
            })
            return;
        };
        try{
            const body = newTodo;
            await fetch("/todos", {
                method:"POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(body)
            });
            
            setNewTodo({title:"", description:""});

            onClose();

            window.location = '/';
            

        } catch (err) {
            console.error(err.message);
        }  
    };
    return (
    <>
        <Container px={4}>
            <VStack
                spacing={4}
            >
                <Heading as={"h1"} size={"xl"} textAlign={"center"} mb={4}>
                    Create New Todo
                </Heading>

                <Box
                    w={"full"} bg={useColorModeValue("white", "gray.800")}
                    p={6} rounded={"lg"} shadow={"md"}
                >
                    <VStack>
                        <FormControl isRequired>
                            <Input 
                                required
                                placeholder = 'Task Title'
                                name="title"
                                value={newTodo.title}
                                onChange={(e) => setNewTodo({...newTodo, title: e.target.value })}
                            />
                        </FormControl>
                        <FormControl>
                            <Textarea 
                                placeholder = 'Task Description (optional)'
                                name="description"
                                value={newTodo.description}
                                onChange={(e) => setNewTodo({...newTodo, description: e.target.value })}
                            />
                        </FormControl>
                        <Button type="submit" colorScheme="blue" onClick={handleAddTask} w="full">
                            Add Task
                        </Button>
                    </VStack>
                </Box>
            </VStack>
        </Container>
    </>

    );
};

export default InputTodo;