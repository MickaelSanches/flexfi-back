import { Request, Response } from 'express';
import cardService from '../services/cardService';

export class CardController {
  // Sélectionner une carte
  async selectCard(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as any;
      const userId = user?._id;
      const { cardType } = req.body;
      
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      
      if (!cardType || !['standard', 'gold', 'platinum'].includes(cardType)) {
        res.status(400).json({ message: 'Valid cardType is required (standard, gold, or platinum)' });
        return;
      }
      
      const card = await cardService.selectCard(userId.toString(), cardType);
      
      res.status(201).json({
        id: card._id,
        cardType: card.cardType,
        status: card.status,
        limits: card.limits,
        createdAt: card.createdAt
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  
  // Obtenir les détails de la carte
  async getCard(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as any;
      const userId = user?._id;
      
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      
      const card = await cardService.getCardByUserId(userId.toString());
      
      if (!card) {
        res.status(404).json({ message: 'Card not found' });
        return;
      }
      
      // Ne renvoyer les détails de la carte virtuelle que si la carte est active
      const cardResponse = {
        id: card._id,
        cardType: card.cardType,
        status: card.status,
        limits: card.limits,
        virtualCardDetails: card.status === 'active' ? card.virtualCardDetails : undefined,
        createdAt: card.createdAt,
        updatedAt: card.updatedAt
      };
      
      res.status(200).json(cardResponse);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  
  // Activer une carte
  async activateCard(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as any;
      const userId = user?._id;
      const { cardId } = req.params;
      
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      
      if (!cardId) {
        res.status(400).json({ message: 'cardId is required' });
        return;
      }
      
      const card = await cardService.activateCard(cardId);
      
      if (!card) {
        res.status(404).json({ message: 'Card not found' });
        return;
      }
      
      res.status(200).json({
        id: card._id,
        cardType: card.cardType,
        status: card.status,
        virtualCardDetails: card.virtualCardDetails,
        limits: card.limits,
        updatedAt: card.updatedAt
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  
  // Bloquer une carte
  async blockCard(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as any;
      const userId = user?._id;
      const { cardId } = req.params;
      
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      
      if (!cardId) {
        res.status(400).json({ message: 'cardId is required' });
        return;
      }
      
      const card = await cardService.blockCard(cardId);
      
      if (!card) {
        res.status(404).json({ message: 'Card not found' });
        return;
      }
      
      res.status(200).json({
        id: card._id,
        cardType: card.cardType,
        status: card.status,
        updatedAt: card.updatedAt
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new CardController();