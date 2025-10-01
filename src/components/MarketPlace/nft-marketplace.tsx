'use client'

import { useState, useMemo, memo, useCallback } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import NFTItemCard from '@/components/MarketPlace/NFTItemCard'
import SellNFTModal from '@/components/MarketPlace/sell-nft-modal'
import BuyNFTModal from '@/components/MarketPlace/buy-nft-modal'
import ProductCard, { Product } from '@/components/MarketPlace/product-card'
import RedeemProductModal from '@/components/MarketPlace/redeem-product-modal'

// Move mock data outside component to prevent recreation
const mockNFTs = [
    {
        id: '1',
        name: 'Cool Cat #1',
        image: '/avatar/bear1.png',
        price: null,
        owner: '0x1234...5678',
        level: 3,
        days: 45,
        points: 750
    },
    {
        id: '2',
        name: 'Bored Ape #42',
        image: '/avatar/bear2.png',
        price: 1.5,
        owner: '0xMarket',
        level: 5,
        days: 60,
        points: 1200
    },
    {
        id: '3',
        name: 'Punk #007',
        image: '/avatar/buffalo1.png',
        price: 2.0,
        owner: '0xMarket',
        level: 4,
        days: 55,
        points: 1000
    },
    {
        id: '4',
        name: 'Doodle #123',
        image: '/avatar/buffalo2.png',
        price: null,
        owner: '0x1234...5678',
        level: 2,
        days: 30,
        points: 500
    },
    {
        id: '5',
        name: 'Punk #007',
        image: '/avatar/pig1.png',
        price: 2.0,
        owner: '0xMarket',
        level: 6,
        days: 75,
        points: 1500
    },
    {
        id: '6',
        name: 'Doodle #123',
        image: '/avatar/pig2.png',
        price: null,
        owner: '0x1234...5678',
        level: 1,
        days: 15,
        points: 250
    }
]

const mockProducts: Product[] = [
    {
        id: 'p1',
        name: 'Protein Powder',
        image: '/products/whey.png',
        category: 'nutrition',
        pointsRequired: 500,
        minLevel: 3,
        description: 'Premium whey protein for muscle recovery',
        stock: 10
    },
    {
        id: 'p2',
        name: 'Yoga Mat',
        image: '/products/yoga-mat.png',
        category: 'sports',
        pointsRequired: 300,
        minLevel: 1,
        description: 'gray Yoga Adidas mat',
        stock: 15
    },
    {
        id: 'p3',
        name: 'Resistance Bands',
        image: '/products/band.png',
        category: 'sports',
        pointsRequired: 250,
        minLevel: 2,
        description: 'Set of 5 resistance bands',
        stock: 20
    },
    {
        id: 'p4',
        name: 'Multivitamin',
        image: '/products/vitamin.png',
        category: 'nutrition',
        pointsRequired: 10,
        minLevel: 1,
        description: 'Daily multivitamin supplement',
        stock: 8
    },
    {
        id: 'p5',
        name: 'Dumbbells Set',
        image: '/products/dumbell.png',
        category: 'sports',
        pointsRequired: 800,
        minLevel: 5,
        description: 'Adjustable dumbbells 5-25kg',
        stock: 5
    }
]


interface NFT {
    id: string;
    name: string;
    image: string;
    price: number | null;
    owner: string;
    level: number;
    days: number;
    points: number;
}

export default function NFTMarketplace() {
    const [nfts, setNfts] = useState<NFT[]>(mockNFTs)
    const [products, setProducts] = useState<Product[]>(mockProducts)
    const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [isSellModalOpen, setIsSellModalOpen] = useState(false)
    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false)
    const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('market')

    const handleSellNFT = useCallback((nft: NFT) => {
        setSelectedNFT(nft)
        setIsSellModalOpen(true)
    }, [])

    const handleBuyNFT = useCallback((nft: NFT) => {
        setSelectedNFT(nft)
        setIsBuyModalOpen(true)
    }, [])

    const handleSetPrice = useCallback((price: number) => {
        if (selectedNFT) {
            const updatedNFTs = nfts.map((nft) =>
                nft.id === selectedNFT.id ? { ...nft, price, owner: '0xMarket' } : nft
            )
            setNfts(updatedNFTs)
            setIsSellModalOpen(false)
        }
    }, [selectedNFT, nfts])

    const handleBuy = useCallback(() => {
        if (selectedNFT) {
            const updatedNFTs = nfts.map((nft: NFT) =>
                nft.id === selectedNFT.id ? { ...nft, price: null, owner: '0x1234...5678' } : nft
            )
            setNfts(updatedNFTs)
            setIsBuyModalOpen(false)
        }
    }, [selectedNFT, nfts])

    const handleRedeemProduct = useCallback((product: Product) => {
        setSelectedProduct(product)
        setIsRedeemModalOpen(true)
    }, [])

    const handleConfirmRedeem = useCallback((nftTokenId: string) => {
        if (selectedProduct) {
            // Update product stock
            const updatedProducts = products.map((p) =>
                p.id === selectedProduct.id ? { ...p, stock: p.stock - 1 } : p
            )
            setProducts(updatedProducts)
            setIsRedeemModalOpen(false)
            // In real implementation, this would call smart contract to redeem points from NFT
            console.log('Redeeming with NFT:', nftTokenId)
            alert(`Successfully redeemed ${selectedProduct.name}!`)
        }
    }, [selectedProduct, products])

    const marketNFTs = useMemo(() => nfts.filter((nft) => nft.owner === '0xMarket'), [nfts])
    const myNFTs = useMemo(() => nfts.filter((nft) => nft.owner === '0x1234...5678'), [nfts])
    const sportsProducts = useMemo(() => products.filter((p) => p.category === 'sports'), [products])
    const nutritionProducts = useMemo(() => products.filter((p) => p.category === 'nutrition'), [products])

    return (
        <div className="h-screen overflow-y-auto bg-gradient-to-br from-orange-600 via-red-600 to-orange-800">
            <div className="max-w-md mx-auto">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="sticky top-0 z-10 grid grid-cols-3 bg-yellow-400 border-t-2 border-l-2 border-r-4 border-b-4 border-black rounded-2xl p-3 mt-2 mb-4 w-full gap-2 h-14">
                        <TabsTrigger
                            value="market"
                            className={`
                                px-3 py-3 text-sm font-bold rounded-xl transition-all duration-200 flex-1 min-w-0
                                ${activeTab === 'market'
                                    ? 'bg-orange-500 text-white border-t-2 border-l-2 border-r-4 border-b-4 border-black shadow-md'
                                    : 'text-black hover:bg-yellow-300'}
                            `}
                        >
                            <span className="truncate">Market</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="my-nfts"
                            className={`
                                px-3 py-3 text-sm font-bold rounded-xl transition-all duration-200 flex-1 min-w-0
                                ${activeTab === 'my-nfts'
                                    ? 'bg-orange-500 text-white border-t-2 border-l-2 border-r-4 border-b-4 border-black shadow-md'
                                    : 'text-black hover:bg-yellow-300'}
                            `}
                        >
                            <span className="truncate">My NFTs</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="shopping"
                            className={`
                                px-3 py-3 text-sm font-bold rounded-xl transition-all duration-200 flex-1 min-w-0
                                ${activeTab === 'shopping'
                                    ? 'bg-orange-500 text-white border-t-2 border-l-2 border-r-4 border-b-4 border-black shadow-md'
                                    : 'text-black hover:bg-yellow-300'}
                            `}
                        >
                            <span className="truncate">Shopping</span>
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="market" className="px-2 pb-3">
                        <div className="space-y-3">
                            {marketNFTs.length === 0 ? (
                                <div className="bg-yellow-400 border-t-2 border-l-2 border-r-4 border-b-4 border-black rounded-2xl p-8 text-center">
                                    <div className="text-6xl mb-4">🏪</div>
                                    <h3 className="text-xl font-bold text-black mb-2">No NFTs for Sale</h3>
                                    <p className="text-black/70 text-sm">Check back later for new listings!</p>
                                </div>
                            ) : (
                                marketNFTs.map((nft) => (
                                    <NFTItemCard
                                        key={nft.id}
                                        nft={nft}
                                        onBuy={handleBuyNFT}
                                        isMarket={true}
                                    />
                                ))
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value="my-nfts" className="px-2 pb-3">
                        <div className="space-y-3">
                            {myNFTs.length === 0 ? (
                                <div className="bg-yellow-400 border-t-2 border-l-2 border-r-4 border-b-4 border-black rounded-2xl p-8 text-center">
                                    <div className="text-6xl mb-4">💎</div>
                                    <h3 className="text-xl font-bold text-black mb-2">No NFTs Owned</h3>
                                    <p className="text-black/70 text-sm">Mint your first NFT to get started!</p>
                                </div>
                            ) : (
                                myNFTs.map((nft) => (
                                    <NFTItemCard
                                        key={nft.id}
                                        nft={nft}
                                        onSell={handleSellNFT}
                                        isMarket={false}
                                    />
                                ))
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value="shopping" className="px-2 pb-3">
                        <div className="space-y-6">
                            {/* Sports Products */}
                            <div>
                                <h3 className="text-xl font-bold text-yellow-400 mb-3 flex items-center gap-2">
                                    <span>🏃</span> Sports Equipment
                                </h3>
                                <div className="space-y-3">
                                    {sportsProducts.length === 0 ? (
                                        <div className="bg-yellow-400 border-t-2 border-l-2 border-r-4 border-b-4 border-black rounded-2xl p-8 text-center">
                                            <div className="text-6xl mb-4">🏋️</div>
                                            <h3 className="text-xl font-bold text-black mb-2">No Sports Products</h3>
                                            <p className="text-black/70 text-sm">Check back later for new items!</p>
                                        </div>
                                    ) : (
                                        sportsProducts.map((product) => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                onRedeem={handleRedeemProduct}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Nutrition Products */}
                            <div>
                                <h3 className="text-xl font-bold text-yellow-400 mb-3 flex items-center gap-2">
                                    <span>🥗</span> Nutrition & Supplements
                                </h3>
                                <div className="space-y-3">
                                    {nutritionProducts.length === 0 ? (
                                        <div className="bg-yellow-400 border-t-2 border-l-2 border-r-4 border-b-4 border-black rounded-2xl p-8 text-center">
                                            <div className="text-6xl mb-4">🥤</div>
                                            <h3 className="text-xl font-bold text-black mb-2">No Nutrition Products</h3>
                                            <p className="text-black/70 text-sm">Check back later for new items!</p>
                                        </div>
                                    ) : (
                                        nutritionProducts.map((product) => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                onRedeem={handleRedeemProduct}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>


            {selectedNFT && (
                <>
                    <SellNFTModal
                        isOpen={isSellModalOpen}
                        onClose={() => setIsSellModalOpen(false)}
                        onSetPrice={handleSetPrice}
                        nft={selectedNFT}
                    />
                    <BuyNFTModal
                        isOpen={isBuyModalOpen}
                        onClose={() => setIsBuyModalOpen(false)}
                        onBuy={handleBuy}
                        nft={selectedNFT}
                    />
                </>
            )}

            <RedeemProductModal
                isOpen={isRedeemModalOpen}
                onClose={() => setIsRedeemModalOpen(false)}
                onRedeem={handleConfirmRedeem}
                product={selectedProduct}
            />
            </div>
        </div>
    )
}