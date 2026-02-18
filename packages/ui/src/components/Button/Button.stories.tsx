import Button from "./Button"
import React from "react"
import {Meta, StoryObj} from "@storybook/react-vite"
import "../../styles.css"

const meta: Meta<typeof Button> = {
    title: "Components/Button",
    component: Button,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered'
    },
    argTypes: {
        variant: {
            control: "select",
            options: ['light', 'dark'],
            description: "Button color"
        },
        size: {
            control: "select",
            options: ["sm", "md", "lg"],
            description: "Button size"
        },
        onClick: {
            action: "clicked"
        },
        disabled: {
            action: "disabled"
        }
    }
}

export default meta

export const Light: StoryObj = {
    args: {
        children: 'Light button',
        variant: 'light'
    }
}

export const Dark: StoryObj = {
    args: {
        children: 'Dark button',
        variant: 'dark'
    }
}

export const Sm: StoryObj = {
    args: {
        children: 'Small button',
        size: 'sm'
    }
}

export const Md: StoryObj = {
    args: {
        children: 'Medium button',
        size: 'md'
    }
}

export const Lg: StoryObj = {
    args: {
        children: 'Large button',
        size: 'lg'
    }
}

export const Disabled: StoryObj = {
    args: {
        children: 'Disabled button',
        disabled: true
    }
}

export const Stories: StoryObj = {
    render: () => (
        <>
            <Button variant="light">Light</Button>
            <Button variant="dark">Dark</Button>
            <Button size="lg">Large</Button>
            <Button size="md">Medium</Button>
            <Button size="sm">Small</Button>
            <Button disabled>Disabled</Button>
        </>
    )
}