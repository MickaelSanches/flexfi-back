import Card, { ICard } from '../models/Card';
import userService from './userService';
import kycService from './kycService';

// Configuration des limites par type de carte
const cardLimits = {
  standard: {
    daily: 1000,
    monthly: 10000
  },
  gold: {
    daily: 5000,
    monthly: 50000
  },
  platinum: {
    daily: 10000,
    monthly: 100000
  }
};

export class CardService {
  // Sélectionner une carte
  async selectCard(
    userId: string,
    cardType: 'standard' | 'gold' | 'platinum'
  ): Promise<ICard> {
    try {
      // Vérifier si l'utilisateur a déjà une carte
      const existingCard = await Card.findOne({ userId });
      if (existingCard) {
        throw new Error('User already has a card');
      }
      
      // Vérifier si l'utilisateur a passé le KYC
      const hasKYC = await kycService.hasApprovedKYC(userId);
      if (!hasKYC) {
        throw new Error('KYC approval required before selecting a card');
      }
      
      // Créer une nouvelle carte
      const card = new Card({
        userId,
        cardType,
        status: 'pending',
        limits: cardLimits[cardType]
      });
      
      await card.save();
      
      // Mettre à jour la carte sélectionnée par l'utilisateur
      await userService.updateSelectedCard(userId, cardType);
      
      return card;
    } catch (error) {
      throw error;
    }
  }
  
  // Récupérer la carte d'un utilisateur
  async getCardByUserId(userId: string): Promise<ICard | null> {
    try {
      return await Card.findOne({ userId });
    } catch (error) {
      throw error;
    }
  }
  
  // Activer une carte
  async activateCard(
    cardId: string
  ): Promise<ICard | null> {
    try {
      // En production, vous appelleriez ici un service de création de carte virtuelle
      // Pour le mock, on génère des informations aléatoires
      const cardNumber = `4111${Math.floor(1000 + Math.random() * 9000)}${Math.floor(1000 + Math.random() * 9000)}${Math.floor(1000 + Math.random() * 9000)}`;
      const expiryMonth = Math.floor(1 + Math.random() * 12).toString().padStart(2, '0');
      const expiryYear = (new Date().getFullYear() + 3).toString().slice(-2);
      const cvv = Math.floor(100 + Math.random() * 900).toString();
      
      return await Card.findByIdAndUpdate(
        cardId,
        {
          status: 'active',
          virtualCardDetails: {
            cardNumber,
            expiryDate: `${expiryMonth}/${expiryYear}`,
            cvv
          }
        },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }
  
  // Bloquer une carte
  async blockCard(
    cardId: string
  ): Promise<ICard | null> {
    try {
      return await Card.findByIdAndUpdate(
        cardId,
        { status: 'blocked' },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }
}

export default new CardService();