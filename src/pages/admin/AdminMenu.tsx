import React, { useState, useRef } from "react";
import {
  useListGems,
  useCreateGem,
  useUpdateGem,
  useDeleteGem,
  useCreateBanner,
  useUpdateBanner,
  useDeleteBanner,
  useListOffers,
  useCreateOffer,
  useUpdateOffer,
  useDeleteOffer,
} from "@/api-client";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";
import { Plus, Edit, Trash2, Image as ImageIcon, Loader2, Tag, X, Upload, ToggleLeft, ToggleRight, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BASE_CATEGORIES = [
  "Blue Sapphire", "Ruby", "Padparadscha", "Teal Sapphire",
  "Yellow Sapphire", "Emerald", "Alexandrite", "Spinel", "Other"
];

const getApiBase = () => {
  const domain = (import.meta as any).env?.VITE_API_URL || "";
  return domain;
};

async function uploadImage(file: File, token: string): Promise<string> {
  const formData = new FormData();
  formData.append("files", file);
  const base = getApiBase();
  const res = await fetch(`${base}/api/upload/image`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return data.urls[0];
}

function getToken() {
  return localStorage.getItem("wg_token") || "";
}

export default function AdminMenu() {
  const { data: gemsData, refetch: refetchGems } = useListGems();
  const createGem = useCreateGem();
  const updateGem = useUpdateGem();
  const deleteGem = useDeleteGem();

  const { data: bannersRaw, refetch: refetchBanners } = useQuery({
    queryKey: ["banners", "all"],
    queryFn: async () => {
      const token = getToken();
      const baseUrl = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${baseUrl}/api/banners/all`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) return [];
      return res.json();
    },
  });
  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();
  const deleteBanner = useDeleteBanner();

  const { data: offersData, refetch: refetchOffers } = useListOffers();
  const createOffer = useCreateOffer();
  const updateOffer = useUpdateOffer();
  const deleteOffer = useDeleteOffer();

  const { toast } = useToast();

  const [isGemModalOpen, setIsGemModalOpen] = useState(false);
  const [editingGemId, setEditingGemId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const gemImageInputRef = useRef<HTMLInputElement>(null);

  const allCategories = [...BASE_CATEGORIES, ...customCategories];

  const initialGemForm = {
    name: "", description: "", price: 0, category: "", stock: 1,
    images: [] as string[], country: "", weight: "", clarity: "",
    size: "", colour: "", shapeAndCut: "", treatment: "", gemType: "",
    isFeatured: false,
  };
  const [gemForm, setGemForm] = useState(initialGemForm);

  const handleGemImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploading(true);
    try {
      const url = await uploadImage(e.target.files[0], getToken());
      setGemForm(f => ({ ...f, images: [...f.images, url] }));
      toast({ title: "Image uploaded" });
    } catch {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
      if (gemImageInputRef.current) gemImageInputRef.current.value = "";
    }
  };

  const removeGemImage = (index: number) => {
    setGemForm(f => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  };

  const handleSaveGem = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGemId) {
      updateGem.mutate({ id: editingGemId, data: gemForm }, {
        onSuccess: () => { toast({ title: "Gem updated" }); setIsGemModalOpen(false); refetchGems(); },
        onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
      });
    } else {
      createGem.mutate({ data: gemForm }, {
        onSuccess: () => { toast({ title: "Gem created" }); setIsGemModalOpen(false); refetchGems(); },
        onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
      });
    }
  };

  const openEditGem = (gem: any) => {
    setEditingGemId(gem.id);
    setGemForm({
      name: gem.name, description: gem.description || "", price: gem.price,
      category: gem.category, stock: gem.stock, images: gem.images || [],
      country: gem.country || "", weight: gem.weight || "", clarity: gem.clarity || "",
      size: gem.size || "", colour: gem.colour || "", shapeAndCut: gem.shapeAndCut || "",
      treatment: gem.treatment || "", gemType: gem.gemType || "", isFeatured: gem.isFeatured || false,
    });
    setIsGemModalOpen(true);
  };

  const handleDeleteGem = (id: string) => {
    if (confirm("Delete this gem? This cannot be undone.")) {
      deleteGem.mutate({ id }, { onSuccess: () => { toast({ title: "Gem deleted" }); refetchGems(); } });
    }
  };

  const handleAddCategory = () => {
    const cat = newCategory.trim();
    if (cat && !allCategories.includes(cat)) {
      setCustomCategories(c => [...c, cat]);
      setNewCategory("");
    }
  };

  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [bannerUploading, setBannerUploading] = useState(false);
  const bannerImageRef = useRef<HTMLInputElement>(null);
  const [bannerForm, setBannerForm] = useState({
    image: "", expiryDays: "", linkedGemId: "", linkedCategory: "", isActive: true,
  });

  const handleBannerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setBannerUploading(true);
    try {
      const url = await uploadImage(e.target.files[0], getToken());
      setBannerForm(f => ({ ...f, image: url }));
      toast({ title: "Banner image uploaded" });
    } catch {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setBannerUploading(false);
      if (bannerImageRef.current) bannerImageRef.current.value = "";
    }
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerForm.image) { toast({ title: "Please upload a banner image", variant: "destructive" }); return; }
    const expiryDate = bannerForm.expiryDays
      ? new Date(Date.now() + parseInt(bannerForm.expiryDays) * 86400000).toISOString()
      : undefined;
    const payload: any = {
      image: bannerForm.image,
      expiryDate,
      linkedGemId: bannerForm.linkedGemId || undefined,
      linkedCategory: bannerForm.linkedCategory || undefined,
      isActive: bannerForm.isActive,
    };
    if (editingBannerId) {
      updateBanner.mutate({ id: editingBannerId, data: payload }, {
        onSuccess: () => { toast({ title: "Banner updated" }); setIsBannerModalOpen(false); refetchBanners(); },
        onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
      });
    } else {
      createBanner.mutate({ data: payload }, {
        onSuccess: () => { toast({ title: "Banner created" }); setIsBannerModalOpen(false); refetchBanners(); },
        onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
      });
    }
  };

  const openEditBanner = (b: any) => {
    setEditingBannerId(b.id);
    setBannerForm({
      image: b.image, expiryDays: "", linkedGemId: b.linkedGemId || "", linkedCategory: b.linkedCategory || "", isActive: b.isActive,
    });
    setIsBannerModalOpen(true);
  };

  const handleToggleBanner = (id: string, isActive: boolean) => {
    updateBanner.mutate({ id, data: { isActive: !isActive } }, { onSuccess: () => refetchBanners() });
  };

  const handleDeleteBanner = (id: string) => {
    if (confirm("Delete this banner?")) {
      deleteBanner.mutate({ id }, { onSuccess: () => { toast({ title: "Banner deleted" }); refetchBanners(); } });
    }
  };

  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [offerForm, setOfferForm] = useState({
    percentage: 10, gemIds: [] as string[], categories: [] as string[], expiryDays: "",
  });

  const toggleOfferGem = (id: string) => {
    setOfferForm(f => ({
      ...f, gemIds: f.gemIds.includes(id) ? f.gemIds.filter(g => g !== id) : [...f.gemIds, id],
    }));
  };

  const toggleOfferCategory = (cat: string) => {
    setOfferForm(f => ({
      ...f, categories: f.categories.includes(cat) ? f.categories.filter(c => c !== cat) : [...f.categories, cat],
    }));
  };

  const handleSaveOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      percentage: offerForm.percentage,
      gemIds: offerForm.gemIds,
      categories: offerForm.categories,
      expiryDays: offerForm.expiryDays ? parseInt(offerForm.expiryDays) : undefined,
    };
    if (editingOfferId) {
      updateOffer.mutate({ id: editingOfferId, data: payload }, {
        onSuccess: () => { toast({ title: "Offer updated" }); setIsOfferModalOpen(false); refetchOffers(); },
        onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
      });
    } else {
      createOffer.mutate({ data: payload }, {
        onSuccess: () => { toast({ title: "Offer created and applied!" }); setIsOfferModalOpen(false); refetchOffers(); refetchGems(); },
        onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
      });
    }
  };

  const openEditOffer = (o: any) => {
    setEditingOfferId(o.id);
    setOfferForm({ percentage: o.percentage, gemIds: o.gemIds || [], categories: o.categories || [], expiryDays: "" });
    setIsOfferModalOpen(true);
  };

  const handleToggleOffer = (id: string, isActive: boolean) => {
    updateOffer.mutate({ id, data: { isActive: !isActive } }, { onSuccess: () => { refetchOffers(); refetchGems(); } });
  };

  const handleDeleteOffer = (id: string) => {
    if (confirm("Delete this offer?")) {
      deleteOffer.mutate({ id }, { onSuccess: () => { toast({ title: "Offer deleted" }); refetchOffers(); refetchGems(); } });
    }
  };

  const gems = gemsData?.gems || [];
  const banners = Array.isArray(bannersRaw) ? bannersRaw : [];
  const offers = Array.isArray(offersData) ? offersData : [];

  return (
    <AdminLayout>
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-100">Catalog Management</h1>
      </div>

      <Tabs defaultValue="gems" className="w-full">
        <TabsList className="bg-slate-900 border border-slate-800 mb-6">
          <TabsTrigger value="gems" className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100">Gems</TabsTrigger>
          <TabsTrigger value="banners" className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100">Banners</TabsTrigger>
          <TabsTrigger value="offers" className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100">Offers</TabsTrigger>
        </TabsList>

        <TabsContent value="gems">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-0">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                <span className="text-slate-400 text-sm">{gems.length} gems total</span>
                <Button className="bg-amber-600 hover:bg-amber-700 text-white" onClick={() => { setEditingGemId(null); setGemForm(initialGemForm); setIsGemModalOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" /> Add Gem
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-400 uppercase bg-slate-950/50 border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Image</th>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Stock</th>
                      <th className="px-6 py-4">Sold Out</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {gems.map(gem => (
                      <tr key={gem.id} className="hover:bg-slate-800/50">
                        <td className="px-6 py-3">
                          <img src={gem.images?.[0] || ""} alt="" className="w-10 h-10 object-cover rounded bg-slate-800" />
                        </td>
                        <td className="px-6 py-3 font-medium text-slate-200">
                          {gem.name}
                          {gem.discountedPrice && <span className="ml-2 text-xs text-red-400">Sale!</span>}
                        </td>
                        <td className="px-6 py-3 text-slate-400">{gem.category}</td>
                        <td className="px-6 py-3">
                          {gem.discountedPrice ? (
                            <div>
                              <span className="line-through text-slate-500 text-xs">{formatCurrency(gem.price)}</span>
                              <span className="text-red-400 ml-1 font-medium">{formatCurrency(gem.discountedPrice)}</span>
                            </div>
                          ) : (
                            <span className="text-amber-500">{formatCurrency(gem.price)}</span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-slate-400">{gem.stock}</td>
                        <td className="px-6 py-3">
                          <Switch
                            checked={gem.soldOut}
                            onCheckedChange={() => updateGem.mutate({ id: gem.id, data: { soldOut: !gem.soldOut } }, { onSuccess: () => refetchGems() })}
                          />
                        </td>
                        <td className="px-6 py-3 text-right space-x-2">
                          <Button size="icon" variant="ghost" onClick={() => openEditGem(gem)}>
                            <Edit className="h-4 w-4 text-blue-400" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleDeleteGem(gem.id)}>
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banners">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-0">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                <span className="text-slate-400 text-sm">{banners.length} banner{banners.length !== 1 ? "s" : ""}</span>
                <Button className="bg-amber-600 hover:bg-amber-700 text-white" onClick={() => { setEditingBannerId(null); setBannerForm({ image: "", expiryDays: "", linkedGemId: "", linkedCategory: "", isActive: true }); setIsBannerModalOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" /> Add Banner
                </Button>
              </div>

              {banners.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>No banners yet. Add one to display on the homepage slider.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {banners.map((banner: any) => (
                    <div key={banner.id} className="p-4 flex items-center gap-4">
                      <img src={banner.image} alt="" className="w-24 h-14 object-cover rounded border border-slate-700 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap gap-2 text-xs">
                          {banner.linkedCategory && (
                            <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                              Category: {banner.linkedCategory}
                            </Badge>
                          )}
                          {banner.linkedGemId && (
                            <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                              Linked Gem
                            </Badge>
                          )}
                          {banner.expiryDate && (
                            <Badge variant="outline" className="border-slate-700 text-slate-500">
                              <Calendar className="h-3 w-3 mr-1" />
                              Expires: {new Date(banner.expiryDate).toLocaleDateString()}
                            </Badge>
                          )}
                          {!banner.isActive && (
                            <Badge variant="outline" className="border-red-500/30 text-red-400">Inactive</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Switch checked={banner.isActive} onCheckedChange={() => handleToggleBanner(banner.id, banner.isActive)} />
                        <Button size="icon" variant="ghost" onClick={() => openEditBanner(banner)}>
                          <Edit className="h-4 w-4 text-blue-400" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDeleteBanner(banner.id)}>
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-0">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                <span className="text-slate-400 text-sm">{offers.length} offer{offers.length !== 1 ? "s" : ""}</span>
                <Button className="bg-amber-600 hover:bg-amber-700 text-white" onClick={() => { setEditingOfferId(null); setOfferForm({ percentage: 10, gemIds: [], categories: [], expiryDays: "" }); setIsOfferModalOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" /> Create Offer
                </Button>
              </div>

              {offers.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <Tag className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>No offers yet. Create a discount offer to apply to gems.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {offers.map((offer: any) => (
                    <div key={offer.id} className="p-4 flex items-start gap-4">
                      <div className="text-3xl font-bold text-red-400 w-16 shrink-0">{offer.percentage}%</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {offer.categories?.map((c: string) => (
                            <Badge key={c} variant="outline" className="text-xs border-blue-500/30 text-blue-400">{c}</Badge>
                          ))}
                          {offer.gemIds?.length > 0 && (
                            <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-400">
                              {offer.gemIds.length} specific gem{offer.gemIds.length !== 1 ? "s" : ""}
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-3 text-xs text-slate-500">
                          {offer.expiryDate && <span>Expires: {new Date(offer.expiryDate).toLocaleDateString()}</span>}
                          <span className={offer.isActive ? "text-emerald-400" : "text-red-400"}>
                            {offer.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Switch checked={offer.isActive} onCheckedChange={() => handleToggleOffer(offer.id, offer.isActive)} />
                        <Button size="icon" variant="ghost" onClick={() => openEditOffer(offer)}>
                          <Edit className="h-4 w-4 text-blue-400" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDeleteOffer(offer.id)}>
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isGemModalOpen} onOpenChange={(open) => { setIsGemModalOpen(open); if (!open) { setEditingGemId(null); setGemForm(initialGemForm); } }}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingGemId ? "Edit Gem" : "Add New Gem"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveGem} className="space-y-5 pt-2">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>Name *</Label>
                <Input required value={gemForm.name} onChange={e => setGemForm(f => ({ ...f, name: e.target.value }))} className="bg-slate-950 border-slate-800" />
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={gemForm.category} onValueChange={v => setGemForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger className="bg-slate-950 border-slate-800">
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-200 max-h-60">
                    {allCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="+ New category..."
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddCategory(); } }}
                    className="bg-slate-950 border-slate-800 text-sm h-8"
                  />
                  <Button type="button" size="sm" variant="outline" className="border-slate-700 h-8" onClick={handleAddCategory}>Add</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Country of Origin</Label>
                <Input value={gemForm.country} onChange={e => setGemForm(f => ({ ...f, country: e.target.value }))} className="bg-slate-950 border-slate-800" placeholder="Sri Lanka" />
              </div>
              <div className="space-y-2">
                <Label>Price (Rs) *</Label>
                <Input type="number" required value={gemForm.price} onChange={e => setGemForm(f => ({ ...f, price: Number(e.target.value) }))} className="bg-slate-950 border-slate-800" />
              </div>
              <div className="space-y-2">
                <Label>Stock</Label>
                <Input type="number" value={gemForm.stock} onChange={e => setGemForm(f => ({ ...f, stock: Number(e.target.value) }))} className="bg-slate-950 border-slate-800" />
              </div>
              <div className="space-y-2">
                <Label>Weight (Carats)</Label>
                <Input value={gemForm.weight} onChange={e => setGemForm(f => ({ ...f, weight: e.target.value }))} className="bg-slate-950 border-slate-800" placeholder="e.g. 2.45 ct" />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <Input value={gemForm.colour} onChange={e => setGemForm(f => ({ ...f, colour: e.target.value }))} className="bg-slate-950 border-slate-800" />
              </div>
              <div className="space-y-2">
                <Label>Clarity</Label>
                <Input value={gemForm.clarity} onChange={e => setGemForm(f => ({ ...f, clarity: e.target.value }))} className="bg-slate-950 border-slate-800" placeholder="Eye Clean" />
              </div>
              <div className="space-y-2">
                <Label>Dimensions</Label>
                <Input value={gemForm.size} onChange={e => setGemForm(f => ({ ...f, size: e.target.value }))} className="bg-slate-950 border-slate-800" placeholder="8.2 x 6.1 mm" />
              </div>
              <div className="space-y-2">
                <Label>Shape & Cut</Label>
                <Input value={gemForm.shapeAndCut} onChange={e => setGemForm(f => ({ ...f, shapeAndCut: e.target.value }))} className="bg-slate-950 border-slate-800" />
              </div>
              <div className="space-y-2">
                <Label>Treatment</Label>
                <Input value={gemForm.treatment} onChange={e => setGemForm(f => ({ ...f, treatment: e.target.value }))} className="bg-slate-950 border-slate-800" placeholder="Unheated" />
              </div>
              <div className="space-y-2">
                <Label>Gem Type</Label>
                <Input value={gemForm.gemType} onChange={e => setGemForm(f => ({ ...f, gemType: e.target.value }))} className="bg-slate-950 border-slate-800" placeholder="Natural Corundum" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>Description</Label>
                <Textarea value={gemForm.description} onChange={e => setGemForm(f => ({ ...f, description: e.target.value }))} className="bg-slate-950 border-slate-800 resize-none" rows={3} />
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={gemForm.isFeatured} onCheckedChange={v => setGemForm(f => ({ ...f, isFeatured: v }))} />
                <Label>Featured gem</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Images</Label>
              <div className="flex flex-wrap gap-3 items-center">
                {gemForm.images.map((img, i) => (
                  <div key={i} className="relative group">
                    <img src={img} className="w-16 h-16 object-cover border border-slate-700 rounded" alt="" />
                    <button
                      type="button"
                      onClick={() => removeGemImage(i)}
                      className="absolute -top-1.5 -right-1.5 bg-red-600 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                ))}
                <Label htmlFor="gem-image-upload" className="w-16 h-16 border border-dashed border-slate-700 rounded flex items-center justify-center cursor-pointer hover:bg-slate-800 transition-colors">
                  {uploading ? <Loader2 className="h-5 w-5 animate-spin text-slate-400" /> : <Upload className="h-5 w-5 text-slate-500" />}
                </Label>
                <input ref={gemImageInputRef} id="gem-image-upload" type="file" className="hidden" accept="image/*" onChange={handleGemImageUpload} disabled={uploading} />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={createGem.isPending || updateGem.isPending} className="bg-amber-600 hover:bg-amber-700 text-white">
                {(createGem.isPending || updateGem.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save Gem
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isBannerModalOpen} onOpenChange={setIsBannerModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingBannerId ? "Edit Banner" : "Add New Banner"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveBanner} className="space-y-5 pt-2">
            <div className="space-y-2">
              <Label>Banner Image *</Label>
              {bannerForm.image ? (
                <div className="relative">
                  <img src={bannerForm.image} alt="" className="w-full h-36 object-cover rounded border border-slate-700" />
                  <button type="button" onClick={() => setBannerForm(f => ({ ...f, image: "" }))} className="absolute top-2 right-2 bg-red-600 rounded-full p-1">
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ) : (
                <Label htmlFor="banner-image-upload" className="w-full h-36 border border-dashed border-slate-700 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-slate-800 transition-colors">
                  {bannerUploading ? <Loader2 className="h-6 w-6 animate-spin text-slate-400" /> : <><Upload className="h-8 w-8 text-slate-500 mb-2" /><span className="text-sm text-slate-500">Click to upload banner image</span></>}
                </Label>
              )}
              <input ref={bannerImageRef} id="banner-image-upload" type="file" className="hidden" accept="image/*" onChange={handleBannerImageUpload} disabled={bannerUploading} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Expiry Duration (days)</Label>
                <Input type="number" min="1" placeholder="No expiry" value={bannerForm.expiryDays} onChange={e => setBannerForm(f => ({ ...f, expiryDays: e.target.value }))} className="bg-slate-950 border-slate-800" />
              </div>
              <div className="space-y-2">
                <Label>Link to Category</Label>
                <Select value={bannerForm.linkedCategory || "_none"} onValueChange={v => setBannerForm(f => ({ ...f, linkedCategory: v === "_none" ? "" : v }))}>
                  <SelectTrigger className="bg-slate-950 border-slate-800">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-200 max-h-48">
                    <SelectItem value="_none">None</SelectItem>
                    {allCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Link to Specific Gem (Gem ID)</Label>
              <Select value={bannerForm.linkedGemId || "_none"} onValueChange={v => setBannerForm(f => ({ ...f, linkedGemId: v === "_none" ? "" : v }))}>
                <SelectTrigger className="bg-slate-950 border-slate-800">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-slate-200 max-h-48">
                  <SelectItem value="_none">None</SelectItem>
                  {gems.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={bannerForm.isActive} onCheckedChange={v => setBannerForm(f => ({ ...f, isActive: v }))} />
              <Label>Active (visible on homepage)</Label>
            </div>
            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={createBanner.isPending || updateBanner.isPending || bannerUploading}>
              {(createBanner.isPending || updateBanner.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingBannerId ? "Update Banner" : "Create Banner"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isOfferModalOpen} onOpenChange={setIsOfferModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingOfferId ? "Edit Offer" : "Create Discount Offer"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveOffer} className="space-y-5 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Discount Percentage *</Label>
                <div className="relative">
                  <Input
                    type="number" required min="1" max="99"
                    value={offerForm.percentage}
                    onChange={e => setOfferForm(f => ({ ...f, percentage: Number(e.target.value) }))}
                    className="bg-slate-950 border-slate-800 pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">%</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Expiry (days)</Label>
                <Input
                  type="number" min="1" placeholder="No expiry"
                  value={offerForm.expiryDays}
                  onChange={e => setOfferForm(f => ({ ...f, expiryDays: e.target.value }))}
                  className="bg-slate-950 border-slate-800"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Apply to Categories</Label>
              <div className="grid grid-cols-2 gap-2 bg-slate-950/60 rounded-md p-3 border border-slate-800 max-h-36 overflow-y-auto">
                {allCategories.map(cat => (
                  <div key={cat} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`offer-cat-${cat}`}
                      checked={offerForm.categories.includes(cat)}
                      onChange={() => toggleOfferCategory(cat)}
                      className="accent-amber-500"
                    />
                    <label htmlFor={`offer-cat-${cat}`} className="text-sm text-slate-300 cursor-pointer">{cat}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Apply to Specific Gems</Label>
              <div className="bg-slate-950/60 rounded-md border border-slate-800 max-h-48 overflow-y-auto divide-y divide-slate-800">
                {gems.map(gem => (
                  <div
                    key={gem.id}
                    className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-slate-800 transition-colors ${offerForm.gemIds.includes(gem.id) ? "bg-slate-800" : ""}`}
                    onClick={() => toggleOfferGem(gem.id)}
                  >
                    <input type="checkbox" checked={offerForm.gemIds.includes(gem.id)} onChange={() => {}} className="accent-amber-500 pointer-events-none" />
                    {gem.images?.[0] && <img src={gem.images[0]} alt="" className="w-8 h-8 rounded object-cover" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-200 truncate">{gem.name}</p>
                      <p className="text-xs text-slate-500">{formatCurrency(gem.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
              {offerForm.gemIds.length > 0 && (
                <p className="text-xs text-amber-400">{offerForm.gemIds.length} gem{offerForm.gemIds.length > 1 ? "s" : ""} selected</p>
              )}
            </div>

            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={createOffer.isPending || updateOffer.isPending}>
              {(createOffer.isPending || updateOffer.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingOfferId ? "Update Offer" : "Create Offer & Apply Discounts"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
