<template>
  <main
    class="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-cyan-500/30 pb-20"
  >
<header class="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 shadow-sm shadow-cyan-900/10">
  <div class="max-w-4xl mx-auto px-4 py-4">
    <div class="flex justify-between items-center">
        <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6">
                    <circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/>
                    <path d="M12 7v3m-3.5 5L7 17m8.5-2L17 17" opacity="0.5" />
                </svg>
            </div>
            <div>
                <h1 class="text-2xl font-black tracking-tighter text-white uppercase leading-none">Net<span class="text-cyan-400">Scope</span></h1>
                <div class="flex gap-2 mt-1">
                    <span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Subnetting</span>
                    <span class="text-[9px] font-bold text-slate-700">•</span>
                    <span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">VLSM Engine</span>
                    <span class="text-[9px] font-bold text-slate-700">•</span>
                    <span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Binary Vision</span>
                </div>
            </div>
        </div>

        <div class="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button @click="activeTab = 'ipv4'" :class="activeTab === 'ipv4' ? 'bg-slate-800 text-cyan-400 border-slate-700' : 'text-slate-500'" class="px-4 py-1.5 text-xs font-bold rounded-lg border transition-all">IPv4</button>
            <button @click="activeTab = 'ipv6'" :class="activeTab === 'ipv6' ? 'bg-slate-800 text-emerald-400 border-slate-700' : 'text-slate-500'" class="px-4 py-1.5 text-xs font-bold rounded-lg border transition-all">IPv6</button>
        </div>
    </div>
  </div>
</header>

    <div class="max-w-4xl mx-auto px-4 mt-8 space-y-6">
      <section
        class="bg-slate-900 rounded-[2rem] p-6 border border-slate-800 shadow-xl relative overflow-hidden"
      >
        <div
          class="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"
        ></div>

        <div class="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
          <div class="md:col-span-3 space-y-2">
            <div class="flex justify-between items-end">
              <label
                class="text-xs font-bold text-slate-500 uppercase tracking-widest"
                >Endereço {{ activeTab === "ipv4" ? "IPv4" : "IPv6" }}</label
              >
              <div
                v-if="isValidIP && activeResult"
                class="flex gap-2 animate-fade-in"
              >
                <span
                  v-if="activeTab === 'ipv4'"
                  class="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-700"
                  >{{ (activeResult as IPv4Result).networkClass }}</span
                >
                <span
                  :class="getTypeColor(activeResult.networkType)"
                  class="px-2 py-0.5 rounded text-[10px] font-bold border"
                  >{{ activeResult.networkType }}</span
                >
              </div>
            </div>
            <div class="relative">
              <input
                v-model="ipInput"
                type="text"
                :placeholder="
                  activeTab === 'ipv4' ? '192.168.0.1' : '2001:db8::1'
                "
                :class="
                  isValidIP
                    ? 'border-slate-700 focus:border-cyan-500 focus:ring-cyan-500/20'
                    : 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20 text-red-400'
                "
                class="w-full bg-slate-950 border rounded-xl px-4 py-3 text-lg font-mono text-white outline-none focus:ring-4 transition-all placeholder:text-slate-700"
              />
            </div>
          </div>

          <div class="md:col-span-2 space-y-2 flex flex-col justify-center">
            <div class="flex justify-between items-end">
              <label
                class="text-xs font-bold text-slate-500 uppercase tracking-widest"
                >Prefixo (CIDR)</label
              >
              <div
                class="flex items-center bg-slate-950 rounded-lg border border-slate-800 overflow-hidden focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all"
              >
                <span class="pl-3 text-cyan-400 font-mono font-bold text-lg"
                  >/</span
                >
                <input
                  v-model.number="cidrInput"
                  type="number"
                  :min="0"
                  :max="activeTab === 'ipv4' ? 32 : 128"
                  class="w-14 bg-transparent text-cyan-400 font-mono font-bold text-lg py-1 px-1 outline-none hide-arrows text-center"
                />
              </div>
            </div>
            <input
              v-model.number="cidrInput"
              type="range"
              :min="0"
              :max="activeTab === 'ipv4' ? 32 : 128"
              class="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 mt-2"
            />
          </div>
        </div>

        <div
          v-if="activeTab === 'ipv4'"
          class="mt-6 pt-6 border-t border-slate-800/50 relative z-10 animate-fade-in"
        >
          <div
            class="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3"
          >
            <span
              >Porção de Rede
              <span class="text-cyan-400">({{ cidrInput }} Bits)</span></span
            >
            <span
              >Porção de Host
              <span class="text-slate-500"
                >({{ 32 - cidrInput }} Bits)</span
              ></span
            >
          </div>
          <div class="flex justify-between gap-1 w-full">
            <div
              v-for="octet in 4"
              :key="octet"
              class="flex gap-1 flex-1 justify-center"
            >
              <div
                v-for="bit in 8"
                :key="bit"
                :class="
                  isNetworkBit((octet - 1) * 8 + bit)
                    ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                    : 'bg-slate-800'
                "
                class="h-6 flex-1 rounded-sm transition-colors duration-300"
              ></div>
            </div>
          </div>
        </div>
      </section>

      <div
        v-if="isValidIP && activeResult"
        class="flex flex-wrap items-center gap-6 mt-4 px-1 border-t border-slate-800/50 pt-4 animate-fade-in"
      >
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-1.5">
            <div
              class="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_5px_rgba(6,182,212,0.5)]"
            ></div>
            <span
              class="text-[10px] font-bold text-slate-500 uppercase tracking-tight"
              >Rede / Sub-rede</span
            >
          </div>
          <div class="flex items-center gap-1.5">
            <div class="w-2 h-2 rounded-full bg-slate-700"></div>
            <span
              class="text-[10px] font-bold text-slate-500 uppercase tracking-tight"
              >Hosts Disponíveis</span
            >
          </div>
        </div>

        <div class="hidden md:block h-4 w-px bg-slate-800"></div>

        <div
          class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight"
        >
          <span class="text-slate-600">Contexto:</span>

          <template v-if="activeTab === 'ipv4'">
            <span
              v-if="activeResult.networkType === 'Privado'"
              class="text-emerald-500"
              >Uso interno (RFC 1918) - Não roteável na internet</span
            >
            <span
              v-else-if="activeResult.networkType === 'Público'"
              class="text-cyan-500"
              >Endereço Global - Roteável na internet</span
            >
            <span
              v-else-if="activeResult.networkType === 'Loopback'"
              class="text-purple-500"
              >Interface Local - Comunicação interna do host</span
            >
            <span v-else class="text-amber-500"
              >Range reservado para fins técnicos ou experimentais</span
            >
          </template>

          <template v-else>
            <span
              v-if="activeResult.networkType === 'Global Unicast'"
              class="text-cyan-500"
              >Roteável Globalmente - O equivalente ao IP público</span
            >
            <span
              v-else-if="activeResult.networkType === 'Link-Local'"
              class="text-amber-500"
              >Limitado ao segmento físico (camada 2) - Não passa por
              roteadores</span
            >
            <span
              v-else-if="activeResult.networkType === 'Unique Local'"
              class="text-emerald-500"
              >Uso Interno (ULA) - Semelhante ao IP privado do IPv4</span
            >
            <span
              v-else-if="activeResult.networkType === 'Loopback'"
              class="text-purple-500"
              >Endereço de Teste Local (::1)</span
            >
            <span
              v-else-if="activeResult.networkType === 'Multicast'"
              class="text-pink-500"
              >Comunicação Um-para-Muitos (FF00::/8)</span
            >
            <span v-else class="text-slate-400"
              >Prefixo de uso específico ou reservado pela IANA</span
            >
          </template>
        </div>
      </div>
      <div
        v-if="isValidIP && activeResult"
        class="flex justify-end gap-3 animate-fade-in"
      >
        <button
          @click="copyReport"
          class="bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center gap-2"
        >
          <svg
            v-if="reportCopied"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="w-4 h-4 text-emerald-500"
          >
            <path
              fill-rule="evenodd"
              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
              clip-rule="evenodd"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="w-4 h-4"
          >
            <path
              fill-rule="evenodd"
              d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z"
              clip-rule="evenodd"
            />
          </svg>
          {{ reportCopied ? "Relatório Copiado!" : "Copiar Relatório" }}
        </button>

        <button
          @click="saveToHistory"
          class="bg-cyan-600 hover:bg-cyan-500 text-slate-950 px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all active:scale-95 flex items-center gap-2"
        >
          Salvar Resultado
        </button>
      </div>

      <section
        v-if="isValidIP && activeResult"
        class="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in"
      >
        <div
          v-for="(value, key) in displayMetrics"
          :key="key"
          class="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/30 transition-colors group relative overflow-hidden"
        >
          <p
            class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1"
          >
            {{ key }}
          </p>
          <div class="flex justify-between items-start gap-4">
            <p class="text-lg font-mono text-white break-all">
              {{ value?.primary }}
            </p>
            <button
              @click="copyToClipboard(value?.primary ?? '', key.toString())"
              class="text-slate-600 hover:text-cyan-400 transition-colors active:scale-90 flex-shrink-0"
            >
              <svg
                v-if="copiedField === key"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="w-5 h-5 text-emerald-500"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="w-5 h-5"
              >
                <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                <path
                  d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"
                />
              </svg>
            </button>
          </div>

          <p
            v-if="value?.secondary"
            class="text-[10px] font-mono text-slate-600 mt-2 truncate group-hover:text-cyan-500/50 transition-colors"
            title="Ver Binário"
          >
            {{ value?.secondary }}
          </p>
        </div>
      </section>

      <section
        v-if="
          activeTab === 'ipv4' && isValidIP && activeResult && cidrInput < 32
        "
        class="mt-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg animate-fade-in"
      >
        <div
          class="p-5 border-b border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-4"
        >
          <div>
            <h3
              class="text-sm font-bold text-cyan-400 uppercase tracking-widest"
            >
              Divisor de Sub-redes (VLSM)
            </h3>
            <p class="text-xs text-slate-500 mt-1">
              Quebre esta rede em sub-redes menores.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <label class="text-xs font-bold text-slate-400"
              >Dividir para prefixo:</label
            >
            <select
              v-model="targetSplitCidr"
              class="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-cyan-400 outline-none focus:border-cyan-500"
            >
              <option
                v-for="i in 32 - cidrInput"
                :key="i"
                :value="cidrInput + i"
              >
                /{{ cidrInput + i }} ({{ Math.pow(2, i) }} redes)
              </option>
            </select>

            <button
              @click="copySubnetsReport"
              v-if="generatedSubnets.length > 0"
              class="bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 px-3 py-2 rounded-lg font-bold text-xs transition-all active:scale-95 flex items-center gap-2"
            >
              <svg
                v-if="subnetsCopied"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="w-4 h-4 text-emerald-500"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="w-4 h-4"
              >
                <path
                  fill-rule="evenodd"
                  d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ subnetsCopied ? "Tabela Copiada!" : "Copiar Tabela" }}
            </button>
          </div>
        </div>

        <div
          v-if="targetSplitCidr > cidrInput"
          class="overflow-x-auto max-h-96"
        >
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead
              class="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider sticky top-0 backdrop-blur-md"
            >
              <tr>
                <th class="px-6 py-3 font-bold">Sub-rede</th>
                <th class="px-6 py-3 font-bold">Range Utilizável</th>
                <th class="px-6 py-3 font-bold">Broadcast</th>
                <th class="px-6 py-3 font-bold">Hosts</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/50">
              <tr
                v-for="(subnet, idx) in generatedSubnets"
                :key="idx"
                class="hover:bg-slate-800/50 transition-colors"
              >
                <td class="px-6 py-3 font-mono text-cyan-400 font-bold">
                  {{ subnet.network }}
                </td>
                <td class="px-6 py-3 font-mono text-slate-300">
                  {{ subnet.range }}
                </td>
                <td class="px-6 py-3 font-mono text-slate-500">
                  {{ subnet.broadcast }}
                </td>
                <td class="px-6 py-3 text-slate-400">{{ subnet.hosts }}</td>
              </tr>
              <tr v-if="Math.pow(2, targetSplitCidr - cidrInput) > 256">
                <td
                  colspan="4"
                  class="px-6 py-4 text-center text-xs text-amber-500 font-bold bg-amber-500/10"
                >
                  Mostrando apenas as primeiras 256 sub-redes para evitar
                  lentidão no navegador. (Total real:
                  {{
                    Math.pow(2, targetSplitCidr - cidrInput).toLocaleString(
                      "pt-BR",
                    )
                  }})
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section
        v-if="history.length > 0"
        class="mt-12 space-y-4 border-t border-slate-800 pt-8"
      >
        <div class="flex justify-between items-center px-2">
          <h3
            class="text-sm font-bold text-slate-400 uppercase tracking-widest"
          >
            Histórico de Cálculos
          </h3>
          <button
            @click="clearHistory"
            class="text-xs font-bold text-red-500/70 hover:text-red-400 transition-colors"
          >
            Limpar Tudo
          </button>
        </div>

        <div
          class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg"
        >
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm whitespace-nowrap">
              <thead
                class="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800"
              >
                <tr>
                  <th class="px-6 py-4 font-bold">Tipo</th>
                  <th class="px-6 py-4 font-bold">Rede CIDR</th>
                  <th class="px-6 py-4 font-bold">Hosts/Subredes</th>
                  <th class="px-6 py-4 font-bold">Ações</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/50">
                <tr
                  v-for="(record, idx) in history"
                  :key="idx"
                  class="hover:bg-slate-800/50 transition-colors group"
                >
                  <td class="px-6 py-4 font-bold">
                    <span
                      :class="
                        record.type === 'IPv4'
                          ? 'text-cyan-400'
                          : 'text-emerald-400'
                      "
                      class="bg-slate-950 px-2 py-1 rounded border border-slate-800 text-[10px]"
                      >{{ record.type }}</span
                    >
                  </td>
                  <td class="px-6 py-4 font-mono text-white">
                    {{ record.network }}
                  </td>
                  <td class="px-6 py-4 text-slate-400">
                    {{ record.capacity }}
                  </td>
                  <td class="px-6 py-4">
                    <button
                      @click="loadFromHistory(record)"
                      class="text-cyan-500 hover:text-cyan-400 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Restaurar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
    <footer class="max-w-4xl mx-auto px-4 mt-20 pb-10">
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-900 pt-8"
      >
        <div>
          <h4
            class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3"
          >
            Conceitos
          </h4>
          <ul class="space-y-2 text-xs text-slate-600 font-medium">
            <li>
              <b class="text-slate-400">CIDR:</b> Classless Inter-Domain
              Routing.
            </li>
            <li>
              <b class="text-slate-400">VLSM:</b> Variable Length Subnet
              Masking.
            </li>
          </ul>
        </div>
        <div>
          <h4
            class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3"
          >
            Dica de Exportação
          </h4>
          <p class="text-xs text-slate-600 leading-relaxed">
            Ao copiar a tabela VLSM, os dados são formatados com tabulação,
            permitindo colar diretamente no Excel ou Sheets.
          </p>
        </div>
        <div class="flex flex-col items-end justify-center">
          <span class="text-xs font-mono text-slate-800">NETSCOPE v1.0</span>
          <span
            class="text-[9px] text-slate-800 uppercase font-bold tracking-tighter"
            >Powered by Clean Arch & Vue 3</span
          >
        </div>
      </div>
    </footer>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import {
  IPCalculator,
  type IPv4Result,
  type IPv6Result,
} from "./domain/IPCalculator";

const activeTab = ref<"ipv4" | "ipv6">("ipv4");
const ipInput = ref("192.168.0.1");
const cidrInput = ref(24);
const copiedField = ref<string | null>(null);
const reportCopied = ref(false);
const subnetsCopied = ref(false);

// Estado para o Splitter (Divisor de redes)
const targetSplitCidr = ref(25);

watch(activeTab, (newTab) => {
  if (newTab === "ipv4") {
    ipInput.value = "192.168.0.1";
    cidrInput.value = 24;
    targetSplitCidr.value = 25;
  } else {
    ipInput.value = "2001:db8::1";
    cidrInput.value = 64;
  }
});

// Reseta o target do Splitter sempre que o CIDR principal muda
watch(cidrInput, (newCidr) => {
  if (
    activeTab.value === "ipv4" &&
    targetSplitCidr.value <= newCidr &&
    newCidr < 32
  ) {
    targetSplitCidr.value = newCidr + 1;
  }
});

const isValidIP = computed(() => {
  const ip = ipInput.value.trim();
  if (activeTab.value === "ipv4") {
    const parts = ip.split(".");
    return (
      parts.length === 4 &&
      parts.every(
        (p) =>
          p !== "" && !isNaN(Number(p)) && Number(p) >= 0 && Number(p) <= 255,
      )
    );
  } else {
    return /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/.test(ip) || ip === "::";
  }
});

const activeResult = computed(() => {
  if (!isValidIP.value) return null;
  try {
    if (activeTab.value === "ipv4") {
      return IPCalculator.calculateIPv4(ipInput.value, cidrInput.value);
    } else {
      return IPCalculator.calculateIPv6(ipInput.value, cidrInput.value);
    }
  } catch (e) {
    return null;
  }
});

// Lógica de Renderização Dinâmica do Visualizador de Bits
function isNetworkBit(bitPosition: number): boolean {
  return bitPosition <= cidrInput.value;
}

// Sub-redes geradas dinamicamente
const generatedSubnets = computed(() => {
  if (
    activeTab.value !== "ipv4" ||
    !isValidIP.value ||
    targetSplitCidr.value <= cidrInput.value
  )
    return [];
  return IPCalculator.generateIPv4Subnets(
    ipInput.value,
    cidrInput.value,
    targetSplitCidr.value,
  );
});

const displayMetrics = computed(() => {
  const res = activeResult.value;
  if (!res) return {};

  if (activeTab.value === "ipv4") {
    const v4 = res as IPv4Result;
    return {
      "Endereço de Rede": { primary: v4.network, secondary: v4.networkBinary },
      "Máscara de Sub-rede": {
        primary: v4.netmask,
        secondary: v4.netmaskBinary,
      },
      "Máscara Curinga (Wildcard)": {
        primary: v4.wildcard,
        secondary: v4.wildcardBinary,
      },
      "Primeiro IP Utilizável": { primary: v4.minHost, secondary: null },
      "Último IP Utilizável": { primary: v4.maxHost, secondary: null },
      "Endereço de Broadcast": {
        primary: v4.broadcast,
        secondary: v4.broadcastBinary,
      },
      "Total de Hosts": {
        primary: v4.numHosts.toLocaleString("pt-BR"),
        secondary: null,
      },
    };
  } else {
    const v6 = res as IPv6Result;
    return {
      "IP Expandido": { primary: v6.ipExpanded, secondary: null },
      "Prefixo da Rede": { primary: v6.network, secondary: null },
      "Último Endereço": { primary: v6.lastAddress, secondary: null },
      "Redes /64 Possíveis": {
        primary: v6.numSubnets64.toString(),
        secondary: "Padrão SLAAC",
      },
    };
  }
});

function getTypeColor(type: string) {
  if (type === "Público" || type === "Global Unicast")
    return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
  if (type === "Privado" || type === "Unique Local")
    return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  if (type === "Loopback")
    return "bg-purple-500/10 text-purple-400 border-purple-500/30";
  return "bg-amber-500/10 text-amber-400 border-amber-500/30";
}

async function copyToClipboard(text: string, fieldKey: string) {
  try {
    await navigator.clipboard.writeText(text);
    copiedField.value = fieldKey;
    setTimeout(() => (copiedField.value = null), 2000);
  } catch (err) {
    console.error(err);
  }
}

async function copyReport() {
  if (!activeResult.value) return;
  let report = `--- RELATÓRIO SUBGRID ---\nTipo: ${activeTab.value.toUpperCase()}\n\n`;
  for (const [key, value] of Object.entries(displayMetrics.value)) {
    report += `${key}: ${value.primary}\n`;
  }
  try {
    await navigator.clipboard.writeText(report);
    reportCopied.value = true;
    setTimeout(() => (reportCopied.value = false), 2500);
  } catch (err) {
    console.error(err);
  }
}

async function copySubnetsReport() {
  if (generatedSubnets.value.length === 0) return;

  let report = `--- DIVISÃO DE SUB-REDES (VLSM) ---\n`;
  report += `Rede Base: ${ipInput.value}/${cidrInput.value} -> Dividida em /${targetSplitCidr.value}\n\n`;

  // O uso de \t (tabulação) permite que ao colar no Excel, cada item vá para uma coluna
  report += `Sub-rede\tRange Utilizável\tBroadcast\tHosts\n`;

  for (const subnet of generatedSubnets.value) {
    report += `${subnet.network}\t${subnet.range}\t${subnet.broadcast}\t${subnet.hosts}\n`;
  }

  // Adiciona o aviso caso a lista esteja truncada
  const totalPossivel = Math.pow(2, targetSplitCidr.value - cidrInput.value);
  if (totalPossivel > 256) {
    report += `\n* Nota: Apenas as primeiras 256 redes de um total de ${totalPossivel.toLocaleString("pt-BR")} foram exportadas.\n`;
  }

  try {
    await navigator.clipboard.writeText(report);
    subnetsCopied.value = true;
    setTimeout(() => (subnetsCopied.value = false), 2500);
  } catch (err) {
    console.error("Erro ao copiar tabela: ", err);
  }
}

// ================= HISTÓRICO =================
interface HistoryRecord {
  type: "IPv4" | "IPv6";
  ip: string;
  cidr: number;
  network: string;
  capacity: string;
}

const history = ref<HistoryRecord[]>([]);

function saveToHistory() {
  if (!activeResult.value) return;
  const record: HistoryRecord = {
    type: activeTab.value === "ipv4" ? "IPv4" : "IPv6",
    ip: ipInput.value,
    cidr: cidrInput.value,
    network:
      activeTab.value === "ipv4"
        ? (activeResult.value as IPv4Result).network
        : (activeResult.value as IPv6Result).network,
    capacity:
      activeTab.value === "ipv4"
        ? `${(activeResult.value as IPv4Result).numHosts} Hosts`
        : `${(activeResult.value as IPv6Result).numSubnets64} Subredes /64`,
  };

  // Adicionado o "!" depois de history.value[0]
  if (history.value.length > 0 && history.value[0]!.network === record.network)
    return;

  history.value.unshift(record);
  if (history.value.length > 10) history.value.pop();
  localStorage.setItem("subgrid-history", JSON.stringify(history.value));
}

function clearHistory() {
  history.value = [];
  localStorage.removeItem("subgrid-history");
}

function loadFromHistory(record: HistoryRecord) {
  activeTab.value = record.type === "IPv4" ? "ipv4" : "ipv6";
  setTimeout(() => {
    ipInput.value = record.ip;
    cidrInput.value = record.cidr;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 50);
}

onMounted(() => {
  const saved = localStorage.getItem("subgrid-history");
  if (saved) history.value = JSON.parse(saved);
});
</script>

<style>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.hide-arrows::-webkit-inner-spin-button,
.hide-arrows::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.hide-arrows {
  -moz-appearance: textfield;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #06b6d4;
  box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
  cursor: pointer;
  margin-top: -6px;
}
input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 8px;
  cursor: pointer;
  background: #1e293b;
  border-radius: 4px;
}
</style>
