import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import type { ChatCompletionRequestMessage } from '$lib/types';
import prisma from '$lib/server/db';

export const POST: RequestHandler = async ({ params, request }) => {
    const { messages }: { messages: ChatCompletionRequestMessage[] } = await request.json();
    console.log('📝 Updating messages for chat:', {
        chatId: params.id,
        messageCount: messages.length
    });

    try {
        // Delete existing messages
        await prisma.message.deleteMany({
            where: { chatId: params.id }
        });

        // Create new messages
        const chat = await prisma.chat.update({
            where: { id: params.id },
            data: {
                messages: {
                    create: messages.map(({ role, content }: ChatCompletionRequestMessage) => ({
                        role,
                        content
                    }))
                },
                updatedAt: new Date()
            },
            include: { messages: true }
        });

        console.log('✅ Messages updated successfully:', {
            chatId: chat.id,
            messageCount: chat.messages.length
        });
        return json(chat);
    } catch (error) {
        console.error('❌ Failed to update messages:', error);
        throw error;
    }
};
